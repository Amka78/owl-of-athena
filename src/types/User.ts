import { ProviderCollection } from "./ProviderCollection";

export type User = {
    id: string;

    first_name?: string;

    last_name?: string;

    birthday?: Date;

    gender: string;

    created_at: string;

    updatedAt: string;

    providers: ProviderCollection;
};
