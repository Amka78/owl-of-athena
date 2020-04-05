import { User } from "../types";

export type AuthState = {
    user?: User;
    token?: string;
    lastUsedEmail?: string;
};
