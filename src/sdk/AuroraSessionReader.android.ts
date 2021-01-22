import { DirectoryInfo } from "./AuroraTypes";

export default class AuroraSessionReader {
    public static async read(
        sessionDirName: string,
        sessionRaw: string,
        sessionDirFilesForCheck?: Array<DirectoryInfo>
    ): Promise<any> {
        const session = {
            name: sessionDirName.split("/").pop(),
            auroraDir: sessionDirName,
            content: sessionRaw,
            streams: [],
        };

        return session;
    }
}
