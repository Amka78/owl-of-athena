//#region Import Modules

import type { Aurora } from "../sdk";
import { ConnectorTypes } from "./AuroraConstants";

//#endregion

//#region Function
const AuroraCmdSyncTime = async function (
    this: Aurora,
    connectorType: ConnectorTypes = ConnectorTypes.ANY,
): Promise<number> {
    const date = new Date();
    const msAfterMidnight =
        date.getHours() * 3600000 +
        date.getMinutes() * 60000 +
        date.getSeconds() * 1000 +
        date.getMilliseconds();

    return await this.queueCmd(
        `clock-set ${date.getFullYear()} ${
            date.getMonth() + 1
        } ${date.getDate()} ${msAfterMidnight}`,
        connectorType,
    );
};
//#endregion
export default AuroraCmdSyncTime;
