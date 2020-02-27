import { buzzSongObjToCmd } from "./util";
import { ConnectorTypes } from "./AuroraConstants";

module.exports = function(
    buzzSong: unknown,
    connectorType: ConnectorTypes = ConnectorTypes.ANY
): unknown {
    const cmd =
        typeof buzzSong == "string" ? buzzSong : buzzSongObjToCmd(buzzSong);

    // @ts-ignore
    return this.queueCmd(cmd, connectorType);
};
