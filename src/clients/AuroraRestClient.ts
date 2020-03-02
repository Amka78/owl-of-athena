import { Auth, Login, CreateUser, User } from "../types";
import RestClient from "./RestClient";

/**
 * Aurora Rest API
 *
 * @export
 * @class AuroraClient
 * @extends {RestClient}
 */
export class AuroraRestClient extends RestClient {
    constructor(
        baseUrl: string,
        locale: string,
        getToken: () => Promise<string | undefined>
    ) {
        super(baseUrl, {
            headers: {
                "Accept-Language": locale
            }
        });
        this.onGetToken = getToken;
    }

    /**
     * Signup
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
     * Login
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

    public async getAuthUser(): Promise<User> {
        const response = await this.get("users/me", {});

        if (response.ok) {
            const result: User = await response.json();

            return result;
        }
        throw await response.json();
    }

    public async updateUser(user: User): Promise<User> {
        console.debug("updateUser called:", user);
        const response = await this.put<Partial<User>>("users/me", {
            first_name: user.first_name,
            last_name: user.last_name,
            gender: user.gender,
            birthday: user.birthday
        });
        console.debug("update result:", response);
        if (response.ok) {
            console.debug("update succeed.");
            return await response.json();
        }
        console.debug("update failed");
        throw await response.json();
    }
}
