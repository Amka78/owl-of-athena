import fs from "fs";
import mkdirp from "mkdirp";
import path from "path";
import { promisify } from "./util";

const AuroraCmdDownloadFile = function(
    srcPath: string,
    destPath: string
): Promise<unknown> {
    return promisify(mkdirp)(path.dirname(destPath)).then(() =>
        // @ts-ignore
        this.readFile(srcPath, fs.createWriteStream(destPath))
    );
};

export default AuroraCmdDownloadFile;
