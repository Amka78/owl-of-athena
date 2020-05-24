import crc32 from "buffer-crc32";
import Stream from "stream";

import { ConnectorTypes } from "./AuroraConstants";
import { CommandResult, FileInfo } from "./AuroraTypes";

const checkCrcSupportedOSVersion = 30000;
const AuroraCmdUploadFile = async function (
    this: any,
    destPath: string,
    dataOrReadStream: string | Stream.Readable | NodeJS.ReadStream,
    // @ts-ignore
    rename = false,
    osVersion = 3000,
    connectorType: ConnectorTypes = ConnectorTypes.ANY
): Promise<CommandResult<FileInfo>> {
    //const destPathSegments = destPath.split("/");

    /*const destFileName = destPathSegments.pop();
    const destFileDir = destPathSegments.length
        ? destPathSegments.join("/")
        : "/";*/
    const destFileName = destPath;
    const destFileDir = "/";

    let crc: number;
    let stream: Stream.Readable;

    //convert to stream in case of string or buffer
    if (
        typeof dataOrReadStream == "string" ||
        Buffer.isBuffer(dataOrReadStream)
    ) {
        stream = new Stream.Readable();
        stream._read = (): void => {
            return;
        };
        stream.push(dataOrReadStream.toString());
        stream.push(null);
    } else {
        stream = dataOrReadStream;
    }

    stream.pause();
    stream.on("data", (chunk) => {
        //crc = crc32.unsigned(chunk);
        // @ts-ignore
        crc = crc32.unsigned(chunk);
    });

    return await this.queueCmd(
        `sd-file-write ${destFileName} ${destFileDir} ${
            rename ? 1 : 0
        } 1 500 0 }`,
        connectorType,
        (_cmd: unknown): void => {
            console.debug(_cmd);
            this.once("cmdInputRequested", (inputStream: any) => {
                stream.pipe(inputStream);
                stream.resume();
            });
        }
    ).then((cmdWithResponse: { response: { crc: string } }) => {
        if (cmdWithResponse.response.crc) {
            const deviceCrc = parseInt(cmdWithResponse.response.crc);
            if (deviceCrc !== crc) return Promise.reject("CRC failed.");
        }

        return cmdWithResponse;
    });
};

export default AuroraCmdUploadFile;
