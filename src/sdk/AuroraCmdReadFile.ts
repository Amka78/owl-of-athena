import { promisifyStream } from "./util";
import * as _ from "lodash";
import crc32 from "buffer-crc32";
import { ConnectorTypes } from "./AuroraConstants";
import { CommandResult } from "./AuroraTypes";
import Stream from "stream";
import { Aurora } from "./Aurora";
import { HeatshrinkDecoder } from "heatshrink-ts";

const COMMAND_COMPRESSION_WINDOW_SIZE = 8;
const COMMAND_COMPRESSION_LOOKAHEAD_SIZE = 4;
const AuroraCmdReadFile = async function (
    this: Aurora,
    srcPath: string,
    writeStream: boolean,
    compress: boolean,
    connectorType: ConnectorTypes = ConnectorTypes.ANY
): Promise<unknown> {
    console.debug("start AuroraCmdReadFile.");
    console.debug("srcPath:", srcPath);
    console.debug("writeStream:", writeStream);
    const srcPathSegments = srcPath.split("/");

    const srcFileName = srcPathSegments.pop();
    const srcFileDir = srcPathSegments.length ? srcPathSegments.join("/") : "/";

    const outputChunks: any = [];
    let crc: any;
    let stream: Stream.Readable | undefined;

    return await this.queueCmd(
        `sd-file-read ${srcFileName} ${srcFileDir} ${compress ? "1" : "0"}`,
        connectorType,
        // @ts-ignore
        (cmd: CommandResult<unknown>) => {
            cmd.outputStream!.on("data", (chunk) => {
                //crc = crc32.unsigned(chunk, crc);
                crc = crc32.unsigned(chunk);
            });

            stream = cmd.outputStream;

            if (writeStream) {
                stream = stream!.pipe(writeStream);
            }

            stream!.on("data", (chunk) => {
                outputChunks.push(chunk);
            });
        }
    ).then((cmdWithResponse: any) => {
        return promisifyStream(stream!).then(() => {
            console.debug("Calculated Crc:", crc);
            console.debug("Aurora crc:", cmdWithResponse.response.crc);
            /*if (cmdWithResponse.response.crc != crc)
                return Promise.reject("CRC failed.");*/

            if (compress) {
                const compressedArray = [];

                for (const value of outputChunks) {
                    compressedArray.push(...value);
                }
                const decoder = new HeatshrinkDecoder(
                    COMMAND_COMPRESSION_WINDOW_SIZE,
                    COMMAND_COMPRESSION_LOOKAHEAD_SIZE,
                    compressedArray.length
                );

                decoder.process(new Uint8Array(compressedArray));

                // @ts-ignore
                const textDecoder = new TextDecoder();
                cmdWithResponse.output = textDecoder.decode(
                    decoder.getOutput()
                );
            } else {
                cmdWithResponse.output = writeStream
                    ? outputChunks
                    : outputChunks.map(String).join("");
            }
            return cmdWithResponse;
        });
    });
};

export default AuroraCmdReadFile;
