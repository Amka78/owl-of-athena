import fs from "fs";
import fetch from "node-fetch";
import type { Aurora } from "./Aurora";

const AuroraCmdUploadFile = async function (
    this: Aurora,
    srcPath: string,
    destPath: string,
    // @ts-expect-error
    rename = false,
): Promise<unknown> {
    if (srcPath.match(/https?:\/\//i)) {
        return fetch(srcPath).then((res) => {
            return this.writeFile(destPath, res.body as unknown as NodeJS.ReadStream, rename);
        });
    }

    return this.writeFile(destPath, fs.createReadStream(srcPath));
};

export default AuroraCmdUploadFile;
