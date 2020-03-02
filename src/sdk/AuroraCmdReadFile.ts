import { promisifyStream } from "./util";
import crc32 from "buffer-crc32";
import { ConnectorTypes } from "./AuroraConstants";
import { CmdQueue } from "./AuroraTypes";
import Stream from "stream";
import defaultIcon from "react-native-paper/lib/typescript/src/components/MaterialCommunityIcon";

const AuroraCmdReadFile = function(
    srcPath: string,
    writeStream: any = false,
    connectorType: ConnectorTypes = ConnectorTypes.ANY
): unknown {
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

    // @ts-ignore
    return this.queueCmd(
        `sd-file-read ${srcFileName} ${srcFileDir} 0`,
        connectorType,
        (cmd: CmdQueue) => {
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
            if (cmdWithResponse.response.crc != crc)
                return Promise.reject("CRC failed.");

            cmdWithResponse.output = writeStream
                ? outputChunks
                : outputChunks.map(String).join("");

            return cmdWithResponse;
        });
    });
};

export default AuroraCmdReadFile;
