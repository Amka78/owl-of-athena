import { ConnectorTypes } from "./AuroraConstants";
import { Aurora } from "./Aurora";
import AuroraSessionReader from "./AuroraSessionReader";
import { CommandResult, DirectoryInfo } from "./AuroraTypes";

const AuroraCmdGetSessions = async function (
    this: Aurora,
    isFile: boolean,
    filter?: string,
    connector: ConnectorTypes = ConnectorTypes.ANY
): Promise<unknown> {
    const sessions = [];
    let dirReadCmd;

    try {
        console.debug("Start sd-dir-read.");
        dirReadCmd = await this.queueCmd<CommandResult<Array<DirectoryInfo>>>(
            `sd-dir-read sessions ${isFile ? 1 : 0} ${filter ? filter : ""}`,
            connector
        );
        console.debug("Completed sd-dir-read:", dirReadCmd);
    } catch (warn) {
        console.warn(warn);
        return [];
    }

    const sessionDirs = dirReadCmd.response!;

    for (const sessionDir of sessionDirs) {
        let readSessionTxtCmd;
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

            console.debug("Start readFile.");

            readSessionTxtCmd = await this.readFile(
                `${sessionDir.name}/session.txt`,
                false,
                true,
                connector
            );
            console.debug("Completed readFiles:", readSessionTxtCmd);
        } catch (error) {
            console.warn(error);
            continue;
        }

        const session = await AuroraSessionReader.read(
            sessionDir.name,
            readSessionTxtCmd.output,
            sessionDirFiles
        );

        sessions.push(session);
    }

    return sessions;
};

export default AuroraCmdGetSessions;
