import type { AuroraProfile } from "../sdk/AuroraTypes";
import type { CreateUser, Login, User } from "../types";
import type { Auth } from "../types/Auth";
import { supabase } from "./supabase";

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

    return data as Array<AuroraProfile>;
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
