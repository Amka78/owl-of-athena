import { Auth, Login, CreateUser, User } from "../types";
import RestClient from "./RestClient";

import { BaseUrl } from "../utils";
import * as Localization from "expo-localization";
import { AuroraProfile } from "../sdk/AuroraTypes";

/**
 * Managing aurora related RestAPI communication.
 *
 * @export
 * @class AuroraRestClient
 * @extends {RestClient}
 */
export class AuroraRestClient extends RestClient {
    constructor(baseUrl: string, locale: string) {
        super(baseUrl, {
            headers: {
                "Accept-Language": locale,
            },
        });
    }

    /**
     * Request a signup.
     *
     * @param {AuthDto} createUser
     * @returns {(Promise<TokenDto>)}
     * @memberof AuthClient
     */
    public async signup(createUser: CreateUser): Promise<User> {
        const response = await this.post<CreateUser>("users", createUser);

        if (response.ok) {
            return await response.json();
        }
        throw await response.json();
    }

    /**
     * Request a login.
     *
     * @param {Login} login
     * @returns {(Promise<Auth>)}
     * @memberof AuroraClient
     */
    public async login(login: Login): Promise<Auth> {
        const response = await this.post<Login>("auth/email", login);

        if (response.ok) {
            return await response.json();
        }
        throw await response.json();
    }

    /**
     * Obtain the authenticated user information.
     *
     * @returns {Promise<User>}
     * @memberof AuroraRestClient
     */
    public async getAuthUser(): Promise<User> {
        const response = await this.get("users/me", {});

        if (response.ok) {
            const result: User = await response.json();

            return result;
        }
        throw await response.json();
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
        const response = await this.put<Partial<User>>("users/me", {
            first_name: user.first_name,
            last_name: user.last_name,
            gender: user.gender,
            birthday: user.birthday,
        });
        console.debug("update result:", response);
        if (response.ok) {
            console.debug("update succeed.");
            return await response.json();
        }
        console.debug("update failed");
        throw await response.json();
    }

    /**
     * Get aurora profile.
     *
     * @returns {Promise<Array<AuroraProfile>>}
     * @memberof AuroraRestClient
     */
    public async getAuroraProfiles(): Promise<Array<AuroraProfile>> {
        const response = await this.get(
            "aurora-profiles?$sort[updated_at]=-1",
            {}
        );

        if (response.ok) {
            const result: Array<AuroraProfile> = await response.json();

            return result;
        }
        throw await response.json();
    }
}
export default new AuroraRestClient(BaseUrl.get(), Localization.locale);
