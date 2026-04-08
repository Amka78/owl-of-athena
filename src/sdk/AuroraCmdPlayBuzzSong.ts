import type { Aurora } from "./Aurora";
import { ConnectorTypes } from "./AuroraConstants";
import { buzzSongObjToCmd } from "./util";

const AuroraCmdPlayBuzzSong = async function (
    this: Aurora,
    buzzSong: unknown,
    connectorType: ConnectorTypes = ConnectorTypes.ANY,
): Promise<unknown> {
    const cmd = typeof buzzSong == "string" ? buzzSong : buzzSongObjToCmd(buzzSong);

    return await this.queueCmd(cmd, connectorType);
};

export default AuroraCmdPlayBuzzSong;
