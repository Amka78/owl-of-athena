export type Provider = {
    user_id: string;

    provider_type: string;

    provider_key: string;

    provider_data: string;

    activation_expires_at?: Date;

    recovery_expires_at?: Date;
};
