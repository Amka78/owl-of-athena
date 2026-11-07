import fs from "fs";
import fetch from "node-fetch";
import type { FirmwareDownloadProgress } from "../types";
import type { Aurora } from "./Aurora";

const AuroraCmdUploadFile = async function (
    this: Aurora,
    srcPath: string,
    destPath: string,
    rename = false,
    onDownloadProgress?: (progress: FirmwareDownloadProgress) => void,
    onDownloadComplete?: () => void,
): Promise<unknown> {
    if (/^https?:\/\//i.test(srcPath)) {
        const response = await fetch(srcPath);
        if (!response.ok) {
            throw new Error(`Failed to download ${srcPath}: ${response.status}`);
        }

        const totalHeader = response.headers.get("content-length");
        const total = totalHeader ? Number(totalHeader) : undefined;
        let content: string;

        const body = response.body as unknown as {
            getReader?: () => ReadableStreamDefaultReader<Uint8Array>;
        };
        if (body?.getReader) {
            const reader = body.getReader();
            const decoder = new TextDecoder();
            let loaded = 0;
            content = "";
            for (;;) {
                const { done, value } = await reader.read();
                if (done) break;
                loaded += value.byteLength;
                content += decoder.decode(value, { stream: true });
                onDownloadProgress?.({ loaded, total });
            }
            content += decoder.decode();
        } else {
            content = await response.text();
            onDownloadProgress?.({ loaded: content.length, total });
        }

        onDownloadComplete?.();
        return this.writeFile(destPath, content, rename);
    }

    onDownloadComplete?.();
    return this.writeFile(destPath, fs.createReadStream(srcPath));
};

export default AuroraCmdUploadFile;
