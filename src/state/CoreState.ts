import { AuroraClient } from "../clients";
import { User } from "../types";

export type CoreState = {
    auroraClient: AuroraClient;
    user?: User;
};
