import { ledEffectObjToCmd } from "./util";
import { ConnectorTypes } from "./AuroraConstants";
import { Aurora } from "./Aurora";

const AuroraCmdPlayLedEffect = async function(
    this: Aurora,
    ledEffect: unknown,
    connectorType: ConnectorTypes = ConnectorTypes.ANY
): Promise<unknown> {
    const cmd =
        typeof ledEffect == "string" ? ledEffect : ledEffectObjToCmd(ledEffect);

    return await this.queueCmd(cmd, connectorType);
};

export default AuroraCmdPlayLedEffect;
