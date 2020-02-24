import EventEmitter from "events";
import {
    BleCmdStates,
    DataTypes,
    EVENT_ID_MAX,
    EventIdsToNames,
    STREAM_ID_MAX,
    StreamIdsToNames
} from "./AuroraConstants";
import AuroraCmdResponseParser from "./AuroraCmdResponseParser";
export type AuroraCommand = {
    command: unknown;
    response?: unknown;
    error: boolean;
    origin?: string;
};
export type AuroraEvent = {
    eventId: number;
    event: string;
    flags: number;
    time: number;
    origin?: string;
};

export type BluetoothStream = {
    streamId: number;
    stream: string;
    data: number[];
    time: number;
    origin?: string;
};
export class AuroraBluetoothParser extends EventEmitter {
    private cmdResponseParser: AuroraCmdResponseParser;
    private cmdWatchdogTimer: NodeJS.Timeout;
    private cmd?: AuroraCommand;
    private cmdState: BleCmdStates;
    constructor() {
        super();

        this.cmdResponseParser = new AuroraCmdResponseParser();
        this.cmdWatchdogTimer = new NodeJS.Timeout();
        this.cmdState = BleCmdStates.IDLE;
        this.reset();
    }

    public reset(): void {
        clearTimeout(this.cmdWatchdogTimer);

        this.cmd = undefined;
        this.cmdResponseParser.reset();
        this.cmdState = BleCmdStates.IDLE;
    }

    public setCmd(cmd: unknown): void {
        if (this.cmdState != BleCmdStates.IDLE)
            throw new Error("Parser command state not idle.");

        this.reset();

        this.cmd = {
            command: cmd,
            error: false
        };

        this.cmdWatchdogTimer = setTimeout(this.onCmdTimeout, 2000);
    }

    public onStreamDataCharNotification(dataBuffer: Buffer): void {
        let stream: BluetoothStream | undefined = undefined;
        let streamDataType = DataTypes.UNKNOWN;
        let streamDataLength = 0;

        for (let i = 0; i < dataBuffer.length; i++) {
            if (!stream) {
                const streamId = dataBuffer[i];

                if (streamId > STREAM_ID_MAX) {
                    this.emit("parseError", "Invalid stream id: " + streamId);
                    continue;
                }

                i++;

                if (i < dataBuffer.length) {
                    streamDataType = dataBuffer[i] >> 4;
                    streamDataLength = dataBuffer[i] & 0x0f;

                    if (i + streamDataLength <= dataBuffer.length) {
                        stream = {
                            streamId,
                            stream: StreamIdsToNames[streamId],
                            data: new Array<number>(),
                            time: Date.now()
                        };

                        continue;
                    }
                }

                this.emit("parseError", "Incomplete stream packet.");
            } else {
                switch (streamDataType) {
                    case DataTypes.BOOL:
                    case DataTypes.UINT8:
                        stream.data.push(dataBuffer.readUInt8(i));
                        break;

                    case DataTypes.INT8:
                        stream.data.push(dataBuffer.readInt8(i));
                        break;

                    case DataTypes.UINT16:
                        stream.data.push(dataBuffer.readUInt16LE(i));
                        i += 1;
                        break;

                    case DataTypes.INT16:
                        stream.data.push(dataBuffer.readInt16LE(i));
                        i += 1;
                        break;

                    case DataTypes.UINT32:
                    case DataTypes.PTR:
                        stream.data.push(dataBuffer.readUInt32LE(i));
                        i += 3;
                        break;

                    case DataTypes.INT32:
                        stream.data.push(dataBuffer.readInt32LE(i));
                        i += 3;
                        break;

                    case DataTypes.FLOAT:
                        stream.data.push(dataBuffer.readFloatLE(i));
                        i += 3;
                        break;

                    case DataTypes.UNKNOWN:
                    case DataTypes.STR:
                    case DataTypes.CHAR:
                    default:
                        this.emit(
                            "parseError",
                            "Invalid or unsupported stream data type: " +
                                streamDataType
                        );
                }

                streamDataLength--;

                if (!streamDataLength) {
                    this.emit("streamData", stream);
                    stream = undefined;
                }
            }
        }
    }

    public onAuroraEventCharNotification(eventBuffer: Buffer): void {
        if (eventBuffer.length != 5) {
            this.emit("parseError", "Incomplete event packet.");
            return;
        }

        const eventId = eventBuffer[0];

        if (eventId > EVENT_ID_MAX) {
            this.emit("parseError", "Invalid event id.");
            return;
        }

        this.emit("auroraEvent", {
            eventId,
            event: EventIdsToNames[eventId],
            flags: eventBuffer.readUInt32LE(1),
            time: Date.now()
        });
    }

    public onCmdStatusCharNotification(statusBuffer: Buffer): void {
        this.cmdState = statusBuffer[0];

        clearTimeout(this.cmdWatchdogTimer);

        this.cmdWatchdogTimer = setTimeout(this.onCmdTimeout, 10000);

        if (this.cmdState != BleCmdStates.IDLE && !this.cmd) {
            this.emit("parseError", "Invalid status change. No command set.");
            return;
        }

        switch (this.cmdState) {
            //is this the end of a command? i.e now idle
            case BleCmdStates.IDLE:
                if (this.cmd) {
                    this.cmd.response = this.cmdResponseParser.getResponse();
                    this.cmd.error = statusBuffer[1] !== 0;

                    this.emit("cmdResponse", this.cmd);
                }

                this.reset();

                break;

            //do we have a response to receive
            case BleCmdStates.CMD_RESP_OBJECT_READY:
                //second statusBuffer byte is number of bytes available to read
                this.emit(
                    "cmdResponseRead",
                    statusBuffer[1],
                    this.cmdDataReceiveResponseObject
                );

                break;

            case BleCmdStates.CMD_RESP_TABLE_READY:
                //second statusBuffer byte is number of bytes available to read
                this.emit(
                    "cmdResponseRead",
                    statusBuffer[1],
                    this.cmdDataReceiveResponseTable
                );

                break;

            //command waiting for input
            case BleCmdStates.CMD_INPUT_REQUESTED:
                this.emit("cmdInputRequested");
                clearTimeout(this.cmdWatchdogTimer);

                break;

            default:
                this.emit(
                    "parseError",
                    "Unknown command state: " + statusBuffer[0]
                );
                break;
        }
    }

    public onCmdOutputCharNotification(output: unknown): void {
        this.emit("cmdOutputReady", output);

        clearTimeout(this.cmdWatchdogTimer);
        this.cmdWatchdogTimer = setTimeout(this.onCmdTimeout, 10000);
    }

    private cmdDataReceiveResponseObject = (buffer: Buffer): void => {
        if (this.cmdState != BleCmdStates.CMD_RESP_OBJECT_READY)
            throw new Error("Invalid state to receive object response.");

        try {
            this.cmdResponseParser.parseObject(buffer.toString("ascii"));
        } catch (error) {
            this.emit("parseError", `Failed parsing object: ${error}`);
        }
    };

    private cmdDataReceiveResponseTable = (buffer: Buffer): void => {
        if (this.cmdState != BleCmdStates.CMD_RESP_TABLE_READY)
            throw new Error("Invalid state to receive table response.");

        try {
            this.cmdResponseParser.parseTable(buffer.toString("ascii"));
        } catch (error) {
            this.emit("parseError", `Failed parsing table: ${error}`);
        }
    };

    private onCmdTimeout = (): void => {
        this.triggerCmdError("Command timed out.");
    };

    private triggerCmdError = (message: string): void => {
        this.cmd!.error = true;
        this.cmd!.response = {
            error: -64,
            message
        };

        this.emit("cmdResponse", this.cmd);

        this.reset();
    };
}
