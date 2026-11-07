import type { AuroraProfile, AuroraProfileOption } from "../sdk/AuroraTypes";
import type { CreateUser, Login, User } from "../types";
import type { Auth } from "../types/Auth";
import { supabase } from "./supabase";

type AuroraProfileRow = {
    id: string;
    user_id: string | null;
    name: string;
    title: string | null;
    description: string | null;
    content: string | null;
    options: AuroraProfileOption[] | string | null;
    type: string | null;
    starred: boolean | null;
    parent_profile_id: string | null;
    min_firmware_version: number | null;
    created_at: string;
    updated_at: string;
};

const toEpoch = (value: string | number | null | undefined): number => {
    if (typeof value === "number") return value;
    if (!value) return 0;

    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
};

const toAuroraProfile = (row: AuroraProfileRow): AuroraProfile => ({
    ...row,
    title: row.title ?? row.name,
    description: row.description ?? "",
    content: row.content ?? "",
    options: row.options ?? [],
    type: (row.type as AuroraProfile["type"]) ?? "private",
    starred: row.starred ?? false,
    created_by: row.user_id ?? undefined,
    parent_profile_id: row.parent_profile_id ?? undefined,
    min_firmware_version: row.min_firmware_version ?? 0,
    created_at: toEpoch(row.created_at),
    updated_at: toEpoch(row.updated_at),
});

/**
 * Managing aurora related Supabase communication.
 *
 * @export
 * @class AuroraRestClient
 */
export class AuroraRestClient {
    /** @deprecated Supabase manages auth internally; this is kept for API compatibility. */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public set getTokenCallback(_callback: () => string) {}

    /**
     * Request a signup.
     *
     * @param {CreateUser} createUser
     * @returns {Promise<User>}
     * @memberof AuroraRestClient
     */
    public async signup(createUser: CreateUser): Promise<User> {
        const { data, error } = await supabase.auth.signUp({
            email: createUser.email,
            password: createUser.password,
            options: {
                data: {
                    first_name: createUser.firstName ?? null,
                    last_name: createUser.lastName ?? null,
                    birthday: createUser.birthday ?? null,
                    gender: createUser.gender ?? null,
                    newsletter: createUser.newsletter ?? false,
                },
            },
        });

        if (error) throw error;

        const authUser = data.user!;

        return await this._getUserProfile(authUser.id);
    }

    /**
     * Request a login.
     *
     * @param {Login} login
     * @returns {Promise<Auth>}
     * @memberof AuroraRestClient
     */
    public async login(login: Login): Promise<Auth> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: login.email,
            password: login.password,
        });

        if (error) throw error;

        const user = await this._getUserProfile(data.user.id);
        user.emailConfirmed = !!data.user.email_confirmed_at;

        return {
            user,
            token: data.session.access_token,
        };
    }

    /**
     * Obtain the authenticated user information.
     *
     * @returns {Promise<User>}
     * @memberof AuroraRestClient
     */
    public async getAuthUser(): Promise<User> {
        const { data, error } = await supabase.auth.getUser();

        if (error) throw error;

        return await this._getUserProfile(data.user.id);
    }

    /**
     * Update user information.
     *
     * @param {User} user
     * @returns {Promise<User>}
     * @memberof AuroraRestClient
     */
    public async updateUser(user: User): Promise<User> {
        console.debug("updateUser called:", user);

        const { data, error } = await supabase
            .from("users")
            .update({
                first_name: user.first_name,
                last_name: user.last_name,
                gender: user.gender,
                birthday: user.birthday,
                country_code: user.country_code,
                postal_code: user.postal_code,
            })
            .eq("id", user.id)
            .select()
            .single();

        console.debug("update result:", data);

        if (error) {
            console.debug("update failed");
            throw error;
        }

        console.debug("update succeed.");
        return data as User;
    }

    /**
     * Get aurora profiles.
     *
     * @returns {Promise<Array<AuroraProfile>>}
     * @memberof AuroraRestClient
     */
    public async getAuroraProfiles(): Promise<Array<AuroraProfile>> {
        const { data, error } = await supabase
            .from("aurora_profiles")
            .select("*")
            .order("updated_at", { ascending: false });

        if (error) throw error;

        // 旧スキーマ由来の content が空の行は編集できないため除外する。
        return ((data ?? []) as AuroraProfileRow[])
            .map(toAuroraProfile)
            .filter((profile) => profile.content.trim().length > 0);
    }

    public async createAuroraProfile(
        profile: AuroraProfile,
        userId: string,
    ): Promise<AuroraProfile> {
        const { data, error } = await supabase
            .from("aurora_profiles")
            .insert({
                user_id: userId,
                name: profile.name,
                title: profile.title,
                description: profile.description ?? "",
                content: profile.content ?? "",
                options: Array.isArray(profile.options) ? profile.options : [],
                type: profile.type ?? "private",
                starred: profile.starred ?? false,
                parent_profile_id: profile.parent_profile_id ?? null,
                min_firmware_version: profile.min_firmware_version ?? 0,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) throw error;

        return toAuroraProfile(data as AuroraProfileRow);
    }

    public async updateAuroraProfile(profile: AuroraProfile): Promise<AuroraProfile> {
        const { data, error } = await supabase
            .from("aurora_profiles")
            .update({
                name: profile.name,
                title: profile.title,
                description: profile.description ?? "",
                content: profile.content ?? "",
                options: Array.isArray(profile.options) ? profile.options : [],
                starred: profile.starred ?? false,
                min_firmware_version: profile.min_firmware_version ?? 0,
                updated_at: new Date().toISOString(),
            })
            .eq("id", profile.id)
            .select()
            .single();

        if (error) throw error;

        return toAuroraProfile(data as AuroraProfileRow);
    }

    public async setAuroraProfileStarred(profileId: string, starred: boolean): Promise<void> {
        const { error } = await supabase
            .from("aurora_profiles")
            .update({ starred, updated_at: new Date().toISOString() })
            .eq("id", profileId);

        if (error) throw error;
    }

    public async deleteAuroraProfile(profileId: string): Promise<void> {
        const { error } = await supabase.from("aurora_profiles").delete().eq("id", profileId);

        if (error) throw error;
    }

    private async _getUserProfile(userId: string): Promise<User> {
        // SECURITY DEFINER関数経由で取得/作成（RLSをバイパス、既存ユーザー対応）
        const { data, error } = await supabase
            .rpc("get_or_create_user_profile", { p_user_id: userId })
            .single();

        if (error) throw error;

        return data as User;
    }
}
export default new AuroraRestClient();
