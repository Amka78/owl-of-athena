import AuroraTransformObject from "./AuroraTransformObject";
import AuroraSessionParser from "./AuroraSessionParser";
import moment from "moment";
import stream from "stream";
import { promisifyStream } from "./util";
import { ConnectorTypes } from "./AuroraConstants";
import { Aurora } from "./Aurora";

const AuroraCmdGetSessions = async function(
    this: Aurora,
    isFile = false,
    filter?: string,
    connector: ConnectorTypes = ConnectorTypes.ANY
): Promise<unknown> {
    const sessions = [];
    let dirReadCmd;

    try {
        console.debug("Start sd-dir-read.");
        dirReadCmd = await this.queueCmd(
            `sd-dir-read sessions ${isFile ? 1 : 0} ${filter}`,
            connector
        );
        console.debug("Completed sd-dir-read:", dirReadCmd);
    } catch (error) {
        console.warn(error);
        return [];
    }

    // @ts-ignore
    const sessionDirs = dirReadCmd.response;

    for (const sessionDir of sessionDirs) {
        let readSessionTxtCmd;
        let sessionDirFiles;

        try {
            if (sessionDir.isFile) continue;

            console.debug("Start sd-dir-read command.");
            const sessionDirReadCmd = await this.queueCmd(
                `sd-dir-read ${sessionDir.name} 1`
            );
            console.debug("Completed sd-dir-read command:", sessionDirReadCmd);

            // @ts-ignore
            sessionDirFiles = sessionDirReadCmd.response;

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
            // @ts-ignore
            readSessionTxtCmd = await this.readFile(
                `${sessionDir.name}/session.txt`,
                false,
                connector
            );
            console.debug("Completed readFiles:", readSessionTxtCmd);
        } catch (error) {
            console.warn(error);
            continue;
        }

        const session = {
            name: sessionDir.name.split("/").pop(),
            auroraDir: sessionDir.name,
            content: readSessionTxtCmd.output,
            streams: []
        };

        try {
            let sessionTxtObject;
            let sessionTxtStream = new stream.Readable();

            sessionTxtStream._read = (): void => {
                return;
            };

            sessionTxtStream.push(session.content);
            sessionTxtStream.push(null);

            sessionTxtStream = sessionTxtStream.pipe(
                new AuroraTransformObject()
            );

            sessionTxtStream.on("data", data => {
                sessionTxtObject = data;
            });

            await promisifyStream(sessionTxtStream);

            const parsedSession = await AuroraSessionParser.parseSessionTxtObject(
                sessionTxtObject
            );

            Object.assign(session, parsedSession);

            //make sure sessions actually exist on disk and that the size is reasonable
            for (let i = 0; i < session.streams.length; i++) {
                const streamFile = sessionDirFiles.find(
                    // @ts-ignore
                    file => file.name == session.streams[i].file
                );

                if (
                    !streamFile ||
                    !streamFile.size ||
                    streamFile.size > 100 * 1024 * 1024
                ) {
                    delete session.streams[i];
                    continue;
                }

                // @ts-ignore
                session.streams[i].size = streamFile.size;
            }
        } catch (sessionWithError) {
            //infer the date from the name of the session if we have to
            if (!sessionWithError.date || typeof sessionWithError != "number") {
                sessionWithError.date = +moment.utc(
                    session.name,
                    "YYYY-MM-DD@HHmm"
                );
            }

            //TODO consider logging this event.
            //otherwise we still want to report this session
            Object.assign(session, sessionWithError);
        }

        sessions.push(session);
    }

    return sessions;
};

export default AuroraCmdGetSessions;
