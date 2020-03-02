import { AuroraRestClient } from "../clients";
import { Aurora } from "../sdk/Aurora";

export type CoreState = {
    restClient: AuroraRestClient;
    auroraDevice: Aurora;
};
