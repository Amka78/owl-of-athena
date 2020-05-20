import { EventEmitter } from "events";
import {
    LogNamesToTypeIds,
    STREAM_ID_MAX,
    EVENT_ID_MAX,
    StreamIdsToNames,
    EventIdsToNames,
    EventIds,
} from "./AuroraConstants";
import AuroraCmdResponseParser from "./AuroraCmdResponseParser";
import moment from "moment";
import { CommandResult } from "./AuroraTypes";

enum CmdStates {
    NO_CMD = 0,
    CMD_HEADER = 1,
    CMD_RESPONSE = 2,
    CMD_OUTPUT = 3,
    CMD_INPUT = 4,
    CMD_ERROR = 5,
}
export default class AuroraSerialParser extends EventEmitter {
    private cmdResponseParser: AuroraCmdResponseParser;
    private cmdWatchdogTimer?: NodeJS.Timeout;
    private regexLog: RegExp;
    private cmd?: CommandResult<unknown>;
    private unparsedBuffer?: Buffer;
    private cmdState: CmdStates;
    constructor() {
        super();

        this.cmdResponseParser = new AuroraCmdResponseParser();
        this.cmdWatchdogTimer = undefined;
        this.cmdState = CmdStates.NO_CMD;
        this.reset();

        this.regexLog = new RegExp(
            "^\\< (" +
                Object.keys(LogNamesToTypeIds).join("|") +
                ") \\| (\\d{2}:\\d{2}:\\d{2}\\.\\d{3}) \\> (.+)$"
        );
    }

    public reset(): void {
        this.clearCmdWatchDogTimer();

        this.cmd = undefined;
        this.unparsedBuffer = undefined;
        this.cmdResponseParser.reset();
        this.cmdState = CmdStates.NO_CMD;
    }

    public parseChunk(chunk: Buffer): void {
        //received new data so clear any timeouts
        this.clearCmdWatchDogTimer();

        //don't do anything if chunk is empty
        if (!chunk.length) {
            return;
        }

        //set new timeout, which will get cleared if this
        //line indicates that there is no more data expected
        this.cmdWatchdogTimer = setTimeout(this.onCmdTimeout, 10000);

        //pick up where we left off
        this.unparsedBuffer = Buffer.isBuffer(this.unparsedBuffer)
            ? Buffer.concat([this.unparsedBuffer, chunk])
            : chunk;

        //if we aren't in the middle of processing output
        //lets break this chunk into lines
        if (this.cmdState != CmdStates.CMD_OUTPUT) {
            while (this.unparsedBuffer && this.unparsedBuffer.length) {
                //look for first newline
                const newlineIndex = this.unparsedBuffer.indexOf("\n");

                //no newline, so wait for the next chunk
                if (newlineIndex == -1) {
                    return;
                }

                //we must have a newline now so grab the line
                const bufferLine = this.unparsedBuffer
                    .slice(0, newlineIndex)
                    .toString()
                    .trim();

                //and remove it from the unparsed buffer
                this.unparsedBuffer = this.unparsedBuffer.slice(
                    newlineIndex + 1
                );

                //after trim, if no data is in line, bail
                if (!bufferLine.length) {
                    continue;
                }

                //we have a complete line, so pass it off
                this.parseLine(bufferLine.toString());

                //if we are now receiving output, we need to exit
                //this loop
                // @ts-ignore
                if (this.cmdState == CmdStates.CMD_OUTPUT) break;
            }
        }

        //if we are here, we are currently receiving output.
        //this is where things get tricky since we need to
        //properly identify whether an output footer exists

        const outputFooter =
            "\r\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++";

        //while we have enough bytes to potentially identify the footer
        while (this.unparsedBuffer.length >= outputFooter.length) {
            //look for the footer
            const footerStartIndex = this.unparsedBuffer.indexOf(outputFooter);

            //didn't find full footer, so we consume as much as we can
            if (footerStartIndex == -1) {
                //determine where the first CR is
                const firstCRIndex = this.unparsedBuffer.indexOf("\r");

                //if we don't have one, we can safely consume the entire buffer
                if (firstCRIndex == -1) {
                    this.emit("cmdOutputReady", this.unparsedBuffer);
                    this.unparsedBuffer = undefined;
                    return;
                }

                //we have a CR, so see if we have enough bytes to guarantee the output footer
                //hasn't started yet
                if (
                    this.unparsedBuffer.length >=
                    firstCRIndex + outputFooter.length
                ) {
                    //consume everything up to and including the first CR
                    this.emit(
                        "cmdOutputReady",
                        this.unparsedBuffer.slice(0, firstCRIndex + 1)
                    );
                    this.unparsedBuffer = this.unparsedBuffer.slice(
                        firstCRIndex + 1
                    );
                    continue;
                }

                return;
            }
            //we found the footer!!
            else {
                //if the footer doesn't start at the
                //beginning, we consume everything up to it
                if (footerStartIndex) {
                    //consume everything up to the footer
                    this.emit(
                        "cmdOutputReady",
                        this.unparsedBuffer.slice(0, footerStartIndex)
                    );
                    this.unparsedBuffer = this.unparsedBuffer.slice(
                        footerStartIndex
                    );
                }

                //at this point we have the footer and it is at the beginning
                //of the unparsed buffer so now we have to look for the footer
                //end, which is the second set of \r\n
                const footerEndIndex = this.unparsedBuffer.indexOf("\r\n", 2);

                if (footerEndIndex == -1) return;

                //we found the entire footer, so consume it all (including trailing new lines) and change the state
                this.unparsedBuffer = this.unparsedBuffer.slice(
                    footerEndIndex + 2
                );

                this.cmdState = CmdStates.CMD_RESPONSE;

                break;
            }
        }
    }

    public parseLine(line: string): void {
        switch (this.cmdState) {
            case CmdStates.NO_CMD:
                //trim off whitespace
                line = line.trim();

                //don't do anything if line is empty
                if (!line.length) {
                    return;
                }

                //look for command prompt
                // eslint-disable-next-line no-case-declarations
                const match = line.match(/^# ([a-z-]+.*)$/i);

                if (match) {
                    this.cmd = {
                        command: match[1],
                        error: false,
                    };

                    this.cmdState = CmdStates.CMD_HEADER;
                } else {
                    this.clearCmdWatchDogTimer();
                    this.parseNonCmdResponseLine(line);
                }

                break;

            case CmdStates.CMD_HEADER:
                //look for response start
                if (line.match(/^[-]{64,}$/)) {
                    this.cmdResponseParser.reset();
                    this.cmdState = CmdStates.CMD_RESPONSE;
                } else {
                    this.triggerCmdError("Expected command header.");
                }

                break;

            case CmdStates.CMD_INPUT:
                //look for input footer
                if (line[0] == "." && line.match(/^[.]{64,}$/)) {
                    this.cmdState = CmdStates.CMD_RESPONSE;
                }

                break;

            case CmdStates.CMD_ERROR:
                //look for error footer
                if (line[0] == "~" && line.match(/^[~]{64,}$/)) {
                    this.cmdState = CmdStates.CMD_RESPONSE;
                } else {
                    try {
                        this.cmdResponseParser.parseDetect(line);
                    } catch (error) {
                        this.triggerCmdError(
                            `Invalid command error response: ${error}`
                        );
                    }
                }

                break;

            case CmdStates.CMD_RESPONSE:
                //trim off whitespace
                line = line.trim();

                //don't do anything if line is empty
                if (!line.length) {
                    return;
                }

                //look for output header
                if (line[0] == "+" && line.match(/^[+]{64,}$/)) {
                    this.cmdState = CmdStates.CMD_OUTPUT;
                }
                //look for input header
                else if (line[0] == "." && line.match(/^[.]{64,}$/)) {
                    this.cmdState = CmdStates.CMD_INPUT;

                    this.clearCmdWatchDogTimer();
                    this.cmdWatchdogTimer = setTimeout(
                        this.onCmdTimeout,
                        5 * 60 * 1000
                    );

                    this.emit("cmdInputRequested");
                }
                //look for error header
                else if (line[0] == "~" && line.match(/^[~]{64,}$/)) {
                    this.cmd!.error = true;
                    this.cmdResponseParser.reset();
                    this.cmdState = CmdStates.CMD_ERROR;
                }
                //look for end of response
                else if (line.match(/^[-]{64,}$/)) {
                    this.clearCmdWatchDogTimer();
                    this.cmd!.response = this.cmdResponseParser.getResponse();
                    this.emit("cmdResponse", this.cmd);
                    this.cmdState = CmdStates.NO_CMD;
                }
                //neither, so this is normal command response
                else if (!this.cmd!.error) {
                    try {
                        this.cmdResponseParser.parseDetect(line);
                    } catch (error) {
                        this.triggerCmdError(
                            `Invalid command response: ${error}`
                        );
                    }
                }

                break;
        }
    }

    private triggerCmdError = (message: string): void => {
        this.cmd!.error = true;
        this.cmd!.response = {
            error: -64,
            message,
        };

        this.emit("cmdResponse", this.cmd);

        this.reset();
    };

    private onCmdTimeout = (): void => {
        this.triggerCmdError("Command timed out.");
    };

    private parseNonCmdResponseLine = (line: string): void => {
        if (line.charAt(0) == "<") {
            const logParts = line.match(this.regexLog);

            if (logParts && logParts.length == 4) {
                this.emit("log", {
                    // @ts-ignore
                    typeId: LogNamesToTypeIds[logParts[1].toUpperCase()],
                    type: logParts[1].toUpperCase(),
                    time: +moment(logParts[2], "HH:mm:ss.SSS", true),
                    message: logParts[3],
                });

                return;
            }
        } else if (line.slice(0, 6) == "event-") {
            const eventParts = line.match(
                /^event-(\d{1,2}): (\d+) \[(\S*)\]$/i
            );

            if (eventParts && eventParts.length == 4) {
                const eventId = +eventParts[1];

                if (!isNaN(eventId) && eventId <= EVENT_ID_MAX) {
                    this.emit("auroraEvent", {
                        eventId,
                        event: EventIdsToNames[eventId as EventIds],
                        flags: +eventParts[2],
                        time: Date.now(),
                    });

                    return;
                }
            }
        } else {
            const dataParts = line.match(/^(\S*)-(\d{1,2}): ([\d\s,.-]+)$/i);

            if (dataParts && dataParts.length == 4) {
                const streamId = +dataParts[2];

                if (!isNaN(streamId) && streamId <= STREAM_ID_MAX) {
                    this.emit("streamData", {
                        streamId,
                        stream: StreamIdsToNames[streamId],
                        data: dataParts[3].split(",").map(Number),
                        time: Date.now(),
                    });

                    return;
                }
            }
        }

        this.emit("parseError", line);
    };
    private clearCmdWatchDogTimer(): void {
        if (this.cmdWatchdogTimer) {
            clearTimeout(this.cmdWatchdogTimer);
        }
    }
}
