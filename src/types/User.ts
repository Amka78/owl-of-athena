import type { ProviderCollection } from "./ProviderCollection";
import type { Role } from "./Role";

export type User = {
    id: string;

    first_name?: string;

    last_name?: string;

    birthday: string;

    gender?: string;

    created_at: string;

    updatedAt: string;

    providers?: ProviderCollection;

    emailConfirmed?: boolean;

    roles?: Role[];
};
