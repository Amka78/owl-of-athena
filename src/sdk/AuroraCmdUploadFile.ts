import fs from "fs";
import fetch from "node-fetch";

module.exports = function(
    srcPath: string,
    destPath: string,
    // @ts-ignore
    rename = false
): Promise<unknown> {
    if (srcPath.match(/https?:\/\//i)) {
        return fetch(srcPath).then(res => {
            // @ts-ignore
            return this.writeFile(destPath, res.body, rename);
        });
    }

    // @ts-ignore
    return this.writeFile(destPath, fs.createReadStream(srcPath));
};
