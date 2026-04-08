import fs from "fs";
import mkdirp from "mkdirp";
import path from "path";
import type { Aurora } from "./Aurora";
import { promisify } from "./util";

const AuroraCmdDownloadFile = function (
    this: Aurora,
    srcPath: string,
    destPath: string,
): Promise<unknown> {
    return promisify(mkdirp)(path.dirname(destPath)).then(() =>
        this.readFile(srcPath, fs.createWriteStream(destPath), false),
    );
};

export default AuroraCmdDownloadFile;
