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
    constructor(baseUrl: string, locale: string) {
        super(baseUrl, {
            headers: {
                "Accept-Language": locale
            }
        });
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
}
