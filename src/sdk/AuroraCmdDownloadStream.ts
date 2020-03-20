import mkdirp from "mkdirp";
import path from "path";
import fs from "fs";
import { promisify } from "./util";
import AuroraTransformBinary from "./AuroraTransformBinary";
import { DataTypes, ConnectorTypes } from "./AuroraConstants";
import { Aurora } from "./Aurora";

const AuroraCmdDownloadStream = async function(
    this: Aurora,
    srcPath: string,
    destDir: string,
    type: DataTypes,
    connector: ConnectorTypes = ConnectorTypes.ANY
): Promise<unknown> {
    try {
        await promisify(mkdirp)(destDir);

        let transform;
        let file = path.basename(srcPath);

        if (file.slice(-4) == ".dat" && type != undefined) {
            file = file.slice(0, -4) + ".csv";
            transform = new AuroraTransformBinary(type);
        }

        let writeStream = fs.createWriteStream(path.join(destDir, file));

        if (transform) {
            transform.pipe(writeStream);
            // @ts-ignore
            writeStream = transform;
        }

        await this.readFile(srcPath, writeStream, connector);

        await this.queueCmd(`sd-file-del ${srcPath}`);

        return path.join(destDir, file);
    } catch (error) {
        return Promise.reject(error);
    }
};

export default AuroraCmdDownloadStream;
