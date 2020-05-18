import pick from "lodash/pick";
import fs from "fs";
import readline from "readline";
import path from "path";
import { AuroraBluetoothParser, EventList } from "../../AuroraBluetoothParser";
import { BleCmdStates } from "../../AuroraConstants";
import { AuroraEvent, BluetoothStream } from "../../AuroraTypes";
const parser = new AuroraBluetoothParser();

const events = [
    EventList.cmdResponse,
    EventList.cmdInputRequested,
    EventList.cmdResponseRead,
    EventList.cmdOutputReady,
    EventList.auroraEvent,
    EventList.streamData,
    EventList.parseError,
];

const eventSpies = new Map<EventList, jest.Mock>();

const readMockFile = async (inputFile: string): Promise<number> => {
    const lineReader = readline.createInterface({
        input: fs.createReadStream(path.join(__dirname, inputFile)),
    });

    let lineCount = 0;
    lineReader.on("line", (line) => {
        if (!line.trim()) return;

        lineCount++;

        const lineParts = line.split(":");
        const type = lineParts.shift();
        const response = Buffer.from(lineParts.join(":"));

        switch (type) {
            case "command":
                parser.setCmd(lineParts[0]);
                break;

            case "object":
                parser.onCmdStatusCharNotification(
                    Buffer.from([
                        BleCmdStates.CMD_RESP_OBJECT_READY,
                        response.length,
                    ])
                );
                parser.cmdDataReceiveResponseObject(response);
                break;

            case "table":
                parser.onCmdStatusCharNotification(
                    Buffer.from([
                        BleCmdStates.CMD_RESP_TABLE_READY,
                        response.length,
                    ])
                );
                parser.cmdDataReceiveResponseTable(response);
                break;

            case "output":
                parser.onCmdOutputCharNotification(response);
                break;

            case "input":
                parser.onCmdStatusCharNotification(
                    Buffer.from([BleCmdStates.CMD_INPUT_REQUESTED])
                );
                break;

            case "status":
                parser.onCmdStatusCharNotification(
                    Buffer.from(lineParts[0].split(",").map(Number))
                );
                break;

            case "event":
                parser.onAuroraEventCharNotification(
                    Buffer.from(lineParts[0].split(",").map(Number))
                );
                break;

            case "data":
                parser.onStreamDataCharNotification(
                    Buffer.from(lineParts[0].split(",").map(Number))
                );
                break;

            default:
                console.log("type", type);
                throw new Error("Invalid mock file.");
        }
    });

    return new Promise((resolve, reject) => {
        try {
            lineReader.on("close", () => {
                resolve(lineCount);
            });
        } catch (e) {
            reject(e);
        }
    });
};

const spiesCalled = (
    exectedEvents: EventList[],
    eventSpies: Map<EventList, jest.Mock<any, any>>,
    omitEvents: EventList[] = []
): void => {
    eventSpies.forEach((value: jest.Mock<any, any>, key: EventList) => {
        if (!omitEvents.includes(key) && exectedEvents.includes(key)) {
            expect(value).toHaveBeenCalled();
        }
    });
};

const spiesCalledOnce = (
    exectedEvents: EventList[],
    eventSpies: Map<EventList, jest.Mock<any, any>>,
    omitEvents: EventList[] = []
): void => {
    eventSpies.forEach((value: jest.Mock<any, any>, key: EventList) => {
        if (!omitEvents.includes(key) && exectedEvents.includes(key)) {
            expect(value).toHaveBeenCalledTimes(1);
        }
    });
};

const spiesNeverCalled = (
    exectedEvents: EventList[],
    eventSpies: Map<EventList, jest.Mock<any, any>>,
    omitEvents: EventList[] = []
): void => {
    eventSpies.forEach((value: jest.Mock<any, any>, key: EventList) => {
        if (!omitEvents.includes(key) && exectedEvents.includes(key)) {
            expect(value).toHaveBeenCalledTimes(0);
        }
    });
};

describe("AuroraBluetoothParserTest", () => {
    beforeAll(() => {
        events.forEach((event) =>
            eventSpies.set(
                event,
                jest.fn(() => event)
            )
        );
    });
    beforeEach(() => {
        parser.reset();
        parser.removeAllListeners();
        eventSpies.forEach((value: jest.Mock<any, any>, key: EventList) => {
            value.mockReset();
            parser.on(key, value);
        });
    });

    it("Testing command response bluetooth parsing (success case)...", async () => {
        const testFile = "BluetoothCmdResponseSuccess.mock";
        await readMockFile(testFile);

        spiesCalledOnce([EventList.cmdResponse], eventSpies);
        spiesCalled([EventList.cmdResponseRead], eventSpies);

        isCorrectSucceedResponse();
        spiesNeverCalled([], eventSpies, [
            EventList.cmdResponse,
            EventList.cmdResponseRead,
        ]);
    });

    it("Testing command response bluetooth parsing (error case)...", async () => {
        await readMockFile("BluetoothCmdResponseError.mock");
        spiesCalledOnce([EventList.cmdResponse], eventSpies);
        spiesCalled([EventList.cmdResponseRead], eventSpies);

        const response = getResponseMock();
        if (response!.calls.length === 1) {
            const filteredResponse = pick(
                response!.calls[0][0],
                Object.keys(cmdResponseError)
            );
            expect(filteredResponse).toEqual(cmdResponseError);
        }

        spiesNeverCalled([], eventSpies, [
            EventList.cmdResponse,
            EventList.cmdResponseRead,
        ]);
    });

    /*it("Testing command response bluetooth parsing (timeout case)...", async () => {
        readMockFile("BluetoothCmdResponseTimeout.mock");
        setTimeout(() => {
            spiesCalledOnce([EventList.cmdResponse], eventSpies);
            spiesCalled([EventList.cmdResponseRead], eventSpies);

            const response = getResponseMock();
            if (response!.calls.length === 1) {
                expect(
                    response!.calls[0][0].error &&
                        response!.calls[0][0].response.error
                ).toBeTruthy();
            }

            spiesNeverCalled([], eventSpies, [
                EventList.cmdResponse,
                EventList.cmdResponseRead,
            ]);
        }, 10000);
    });*/

    it("Testing aurora event response bluetooth parsing...", async () => {
        const lineCount = await readMockFile("BluetoothAuroraEvent.mock");

        const auroraEvents = eventSpies.get(EventList.auroraEvent)!;
        expect(auroraEvents).toHaveBeenCalledTimes(lineCount);

        isCorrectAuroraEvent(auroraEvents);
    });

    it("Testing data response bluetooth parsing...", async () => {
        const lineCount = await readMockFile("BluetoothStreamData.mock");
        const streamData = eventSpies.get(EventList.streamData);
        expect(streamData).toHaveBeenCalledTimes(lineCount * 2);

        isCorrectStreamData(streamData!);
    });
    it("Testing bluetooth parse error...", async () => {
        const lineCount = await readMockFile("BluetoothParseError.mock");

        expect(eventSpies.get(EventList.parseError)).toHaveBeenCalledTimes(
            lineCount
        );

        spiesNeverCalled([], eventSpies, [EventList.parseError]);
    });

    it("Testing bluetooth parsing of command with output response...", async () => {
        await readMockFile("BluetoothCmdResponseWithOutput.mock");
        spiesCalledOnce([EventList.cmdResponse], eventSpies);
        spiesCalled(
            [EventList.cmdResponseRead, EventList.cmdOutputReady],
            eventSpies
        );

        isCorrectSucceedResponse();
        spiesNeverCalled([], eventSpies, [
            EventList.cmdResponse,
            EventList.cmdResponseRead,
            EventList.cmdOutputReady,
        ]);
    });

    it("Testing bluetooth parsing of command with input response...", async () => {
        await readMockFile("BluetoothCmdResponseWithInput.mock");
        spiesCalledOnce([EventList.cmdResponse], eventSpies);
        spiesCalled(
            [EventList.cmdResponseRead, EventList.cmdInputRequested],
            eventSpies
        );

        isCorrectSucceedResponse();

        spiesNeverCalled([], eventSpies, [
            EventList.cmdResponse,
            EventList.cmdResponseRead,
            EventList.cmdInputRequested,
        ]);
    });

    it("Testing bluetooth parsing of the perfect storm...", async () => {
        await readMockFile("BluetoothKitchenSink.mock");

        const cmdResponse = eventSpies.get(EventList.cmdResponse);
        const auroraEvent = eventSpies.get(EventList.auroraEvent);
        const streamData = eventSpies.get(EventList.streamData);

        expect(cmdResponse).toHaveBeenCalledTimes(4);

        spiesCalled(
            [EventList.cmdInputRequested, EventList.cmdOutputReady],
            eventSpies
        );

        let filteredResponse;

        //1st call success
        if (cmdResponse!.mock.calls.length == 4) {
            filteredResponse = pick(
                cmdResponse!.mock.calls[0][0],
                Object.keys(cmdResponseSuccess)
            );

            expect(filteredResponse).toEqual(cmdResponseSuccess);

            //2nd call success w/data
            filteredResponse = pick(
                cmdResponse!.mock.calls[1][0],
                Object.keys(cmdResponseSuccess)
            );
            expect(filteredResponse).toEqual(cmdResponseSuccess);

            //3rd call error
            filteredResponse = pick(
                cmdResponse!.mock.calls[2][0],
                Object.keys(cmdResponseError)
            );
            expect(filteredResponse).toEqual(cmdResponseError);

            //4th call contains table
            const fourthSuccess = cmdResponse!.mock.calls[3][0];

            expect(fourthSuccess.error).toBeFalsy();
            expect(Array.isArray(fourthSuccess.response)).toBeTruthy();
            expect(typeof fourthSuccess.response[0]).toBe("object");
        }

        expect(auroraEvent).toHaveBeenCalledTimes(5);
        isCorrectAuroraEvent(auroraEvent!);

        expect(streamData).toHaveBeenCalledTimes(6);
        isCorrectStreamData(streamData!);

        spiesNeverCalled([EventList.parseError], eventSpies);
    });
});

const cmdResponseSuccess = {
    command: "os-info",
    error: false,
    response: {
        versionString: "v1.0.1",
        version: 10001,
        board: "iWinks Aurora v1 rev3",
        buildDate: Date.UTC(2017, 0, 1, 5, 5, 5),
        bytesFree: 5555,
        batteryLevel: 100,
        runningTime: "5.20 h",
        profile: false,
        debugMode: false,
    },
};

const cmdResponseError = {
    command: "command-error",
    error: true,
    response: {
        error: -1,
        message: "Command failed.",
    },
};

function isCorrectStreamData(streamData: jest.Mock<any, any>): void {
    streamData!.mock.calls.forEach((value: BluetoothStream[]) => {
        expect(
            !value[0].stream || value[0].data.length !== value[0].streamId
        ).toBeFalsy();
        if (value[0].data.length > 1) {
            for (let i = 1; i < value[0].data.length; i++) {
                expect(value[0].data[i - 1]).toBe(value[0].data[i] - 1);
            }
        }
    });
}

function isCorrectAuroraEvent(auroraEvents: jest.Mock<any, any>): void {
    auroraEvents.mock.calls.forEach((value: AuroraEvent[]) => {
        expect(value[0].flags).toBe(value[0].eventId ** 10);
    });
}

function isCorrectSucceedResponse(): void {
    const response = getResponseMock();
    if (response.calls.length === 1) {
        const filteredResponse = pick(
            response.calls[0][0],
            Object.keys(cmdResponseSuccess)
        );
        expect(filteredResponse).toEqual(cmdResponseSuccess);
    }
}

function getResponseMock(): jest.MockContext<any, any> {
    return eventSpies.get(EventList.cmdResponse)!.mock;
}
