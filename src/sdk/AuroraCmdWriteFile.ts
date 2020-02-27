import Stream from "stream";
import crc32 from "buffer-crc32";
import { ConnectorTypes } from "./AuroraConstants";

module.exports = function(
    destPath: string,
    dataOrReadStream: string | Stream.Readable,
    // @ts-ignore
    rename = false,
    connectorType: ConnectorTypes = ConnectorTypes.ANY
): unknown {
    const destPathSegments = destPath.split("/");

    const destFileName = destPathSegments.pop();
    const destFileDir = destPathSegments.length
        ? destPathSegments.join("/")
        : "/";

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
    stream.on("data", chunk => {
        crc = crc32.unsigned(chunk);
        //crc = crc32.unsigned(chunk, crc);
    });

    // @ts-ignore
    return this.queueCmd(
        `sd-file-write ${destFileName} ${destFileDir} ${rename ? 1 : 0} 1 500`,
        connectorType,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_cmd: unknown): void => {
            // @ts-ignore
            this.once("cmdInputRequested", inputStream => {
                stream.pipe(inputStream);
                stream.resume();
            });
        }
    ).then((cmdWithResponse: { response: { crc: number } }) => {
        if (cmdWithResponse.response.crc != crc)
            return Promise.reject("CRC failed.");

        return cmdWithResponse;
    });
};
