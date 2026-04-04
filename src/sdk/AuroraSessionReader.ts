import Flat from "flat";
import moment from "moment";
import { parseValueString, camelCaseObjectKeys } from "./util";
import AuroraSessionParser from "./AuroraSessionParser";
import { DirectoryInfo } from "./AuroraTypes";

function transformSessionText(raw: string): any {
    const transformedObject: Record<string, any> = {};
    const lines = raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    for (const line of lines) {
        const keyValue = line.split(":");
        if (keyValue.length >= 2) {
            const key = keyValue.shift()!.trim();
            transformedObject[key] = parseValueString(keyValue.join(":"));
        }
    }

    return camelCaseObjectKeys(Flat.unflatten(transformedObject));
}

/**
 * Shared AuroraSessionReader used on all platforms (web, Android, iOS).
 * Uses direct string parsing instead of Node.js streams.
 */
export default class AuroraSessionReader {
    public static async read(
        sessionDirName: string,
        sessionRaw: string,
        sessionDirFilesForCheck?: Array<DirectoryInfo>
    ): Promise<any> {
        const session: any = {
            name: sessionDirName.split("/").pop(),
            auroraDir: sessionDirName,
            content: sessionRaw,
            streams: [],
        };

        try {
            const sessionTxtObject = transformSessionText(sessionRaw);

            const parsedSession =
                await AuroraSessionParser.parseSessionTxtObject(
                    sessionTxtObject
                );

            Object.assign(session, parsedSession);

            if (sessionDirFilesForCheck) {
                for (let i = 0; i < session.streams.length; i++) {
                    const streamFile = sessionDirFilesForCheck.find(
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

                    session.streams[i].size = streamFile.size;
                }
            }
        } catch (sessionWithError: any) {
            if (
                !sessionWithError.date ||
                typeof sessionWithError != "number"
            ) {
                sessionWithError.date = +moment.utc(
                    session.name,
                    "YYYY-MM-DD@HHmm"
                );
            }
            Object.assign(session, sessionWithError);
        }

        return session;
    }
}
