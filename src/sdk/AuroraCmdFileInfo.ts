import { ConnectorTypes } from "./AuroraConstants";
import { Aurora } from "./Aurora";
import { FileInfo, CommandResult } from "./AuroraTypes";

const AuroraCmdFileInfo = async function (
    this: Aurora,
    srcPath: string,
    connectorType: ConnectorTypes = ConnectorTypes.ANY
): Promise<FileInfo> {
    const srcPathSegments = srcPath.split("/");

    const srcFileName = srcPathSegments.pop();
    const srcFileDir = srcPathSegments.length ? srcPathSegments.join("/") : "/";

    return (
        await this.queueCmd<CommandResult<FileInfo>>(
            `sd-file-info ${srcFileName} ${srcFileDir}`,
            connectorType
        )
    ).response!;
};

export default AuroraCmdFileInfo;
