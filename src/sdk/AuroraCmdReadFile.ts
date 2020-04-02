import { promisifyStream } from "./util";
import crc32 from "buffer-crc32";
import { ConnectorTypes } from "./AuroraConstants";
import { CommandResult } from "./AuroraTypes";
import Stream from "stream";
import { Aurora } from "./Aurora";

const AuroraCmdReadFile = async function(
    this: Aurora,
    srcPath: string,
    writeStream: boolean,
    connectorType: ConnectorTypes = ConnectorTypes.ANY
): Promise<unknown> {
    console.debug("start AuroraCmdReadFile.");
    console.debug("srcPath:", srcPath);
    console.debug("writeStream:", writeStream);
    const srcPathSegments = srcPath.split("/");

    const srcFileName = srcPathSegments.pop();
    const srcFileDir = srcPathSegments.length ? srcPathSegments.join("/") : "/";

    /*
    if (connector != 'bluetooth' && this.isMsdAttached()){


    }
    */

    const outputChunks: any = [];
    let crc: any;
    let stream: Stream.Readable | undefined;

    return await this.queueCmd(
        `sd-file-read ${srcFileName} ${srcFileDir}`,
        connectorType,
        // @ts-ignore
        (cmd: CommandResult<unknown>) => {
            cmd.outputStream!.on("data", chunk => {
                //crc = crc32.unsigned(chunk, crc);
                crc = crc32.unsigned(chunk);
            });

            stream = cmd.outputStream;

            if (writeStream) {
                stream = stream!.pipe(writeStream);
            }

            stream!.on("data", chunk => {
                outputChunks.push(chunk);
            });
        }
    ).then((cmdWithResponse: any) => {
        return promisifyStream(stream!).then(() => {
            console.debug("Calculated Crc:", crc);
            console.debug("Aurora crc:", cmdWithResponse.response.crc);
            /*if (cmdWithResponse.response.crc != crc)
                return Promise.reject("CRC failed.");*/

            cmdWithResponse.output = writeStream
                ? outputChunks
                : outputChunks.map(String).join("");

            return cmdWithResponse;
        });
    });
};

export default AuroraCmdReadFile;
