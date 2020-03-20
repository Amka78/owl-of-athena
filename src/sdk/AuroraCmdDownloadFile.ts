import fs from "fs";
import mkdirp from "mkdirp";
import path from "path";
import { promisify } from "./util";
import { Aurora } from "./Aurora";

const AuroraCmdDownloadFile = function(
    this: Aurora,
    srcPath: string,
    destPath: string
): Promise<unknown> {
    return promisify(mkdirp)(path.dirname(destPath)).then(() =>
        this.readFile(srcPath, fs.createWriteStream(destPath))
    );
};

export default AuroraCmdDownloadFile;
