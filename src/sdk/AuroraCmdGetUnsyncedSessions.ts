import { ConnectorTypes } from "./AuroraConstants";
import { Aurora } from "./Aurora";
import { FileInfo, CommandResult, DirectoryInfo } from "./AuroraTypes";

const AuroraCmdGetUnsyncedSessions = async function (
    this: Aurora,
    filter?: string,
    connector: ConnectorTypes = ConnectorTypes.ANY
): Promise<Array<FileInfo>> {
    const unsyncedSessions: Array<FileInfo> = [];
    let dirReadCmd;

    try {
        console.debug("Start sd-dir-read.");
        dirReadCmd = await this.queueCmd<CommandResult<Array<DirectoryInfo>>>(
            `sd-dir-read sessions 0 ${filter ? filter : ""}`,
            connector
        );
        console.debug("Completed sd-dir-read:", dirReadCmd);
    } catch (warn) {
        console.warn(warn);
        return [];
    }

    const sessionDirs = dirReadCmd.response!;

    for (const sessionDir of sessionDirs) {
        let readFileInfo;
        let sessionDirFiles;

        try {
            if (sessionDir.isFile) continue;

            console.debug("Start sd-dir-read command.");
            const sessionDirReadCmd = await this.queueCmd<
                CommandResult<Array<DirectoryInfo>>
            >(`sd-dir-read ${sessionDir.name} 1`);
            console.debug("Completed sd-dir-read command:", sessionDirReadCmd);

            sessionDirFiles = sessionDirReadCmd.response!;

            const sessionTxtFile = sessionDirFiles.find(
                (file: any): boolean => file.name == "session.txt"
            );

            //make sure text file exists and it's size is reasonable
            if (
                !sessionTxtFile ||
                sessionTxtFile.size < 75 ||
                sessionTxtFile.size > 512 * 1024
            )
                continue;

            console.debug("Start readFileInfo.");
            readFileInfo = await this.readFileInfo(
                `${sessionDir.name}/session.txt`,
                connector
            );
            console.debug("Completed readFileInfo:", readFileInfo);
        } catch (error) {
            console.warn(error);
            continue;
        }

        if (readFileInfo.size) {
            unsyncedSessions.push(readFileInfo);
        }
    }

    return unsyncedSessions;
};

export default AuroraCmdGetUnsyncedSessions;
