import { Auth, Login, CreateUser, User } from "../types";
import RestClient from "./RestClient";

/**
 * Aurora Rest API
 *
 * @export
 * @class AuroraClient
 * @extends {RestClient}
 */
export class AuroraClient extends RestClient {
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
            return await response.json();
        }
        throw await response.json();
    }

    public async updateUser(user: User): Promise<User> {
        const response = await this.put(`users/${user.id}`, user);

        if (response.ok) {
            return await response.json();
        }
        throw await response.json();
    }
}
