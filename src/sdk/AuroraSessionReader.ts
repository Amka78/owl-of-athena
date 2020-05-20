import AuroraTransformObject from "./AuroraTransformObject";
import AuroraSessionParser from "./AuroraSessionParser";
import moment from "moment";
import stream from "stream";
import { promisifyStream } from "./util";
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

            sessionTxtStream.on("data", (data) => {
                sessionTxtObject = data;
            });

            await promisifyStream(sessionTxtStream);

            const parsedSession = await AuroraSessionParser.parseSessionTxtObject(
                sessionTxtObject
            );

            Object.assign(session, parsedSession);

            if (sessionDirFilesForCheck) {
                //make sure sessions actually exist on disk and that the size is reasonable
                for (let i = 0; i < session.streams.length; i++) {
                    const streamFile = sessionDirFilesForCheck.find(
                        // @ts-ignore
                        (file) => file.name == session.streams[i].file
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

        return session;
    }
}
