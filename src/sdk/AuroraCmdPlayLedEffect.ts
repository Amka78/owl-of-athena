import { ledEffectObjToCmd } from "./util";
import { ConnectorTypes } from "./AuroraConstants";

module.exports = function(
    ledEffect: unknown,
    connectorType: ConnectorTypes = ConnectorTypes.ANY
): unknown {
    const cmd =
        typeof ledEffect == "string" ? ledEffect : ledEffectObjToCmd(ledEffect);

    // @ts-ignore
    return this.queueCmd(cmd, connectorType);
};
