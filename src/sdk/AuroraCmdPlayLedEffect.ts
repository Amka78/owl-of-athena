import type { Aurora } from "./Aurora";
import { ConnectorTypes } from "./AuroraConstants";
import { ledEffectObjToCmd } from "./util";

const AuroraCmdPlayLedEffect = async function (
    this: Aurora,
    ledEffect: unknown,
    connectorType: ConnectorTypes = ConnectorTypes.ANY,
): Promise<unknown> {
    const cmd = typeof ledEffect == "string" ? ledEffect : ledEffectObjToCmd(ledEffect);

    return await this.queueCmd(cmd, connectorType);
};

export default AuroraCmdPlayLedEffect;
