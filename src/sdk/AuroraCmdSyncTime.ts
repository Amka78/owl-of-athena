import { ConnectorTypes } from "./AuroraConstants";

const AuroraCmdSyncTime = function(
    connectorType: ConnectorTypes = ConnectorTypes.ANY
): unknown {
    const date = new Date();
    const msAfterMidnight =
        date.getHours() * 3600000 +
        date.getMinutes() * 60000 +
        date.getSeconds() * 1000 +
        date.getMilliseconds();

    // @ts-ignore
    return this.queueCmd(
        `clock-set ${date.getFullYear()} ${date.getMonth() +
            1} ${date.getDate()} ${msAfterMidnight}`,
        connectorType
    );
};

export default AuroraCmdSyncTime;
