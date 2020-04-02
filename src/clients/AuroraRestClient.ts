import { Auth, Login, CreateUser, User } from "../types";
import RestClient from "./RestClient";

import { BaseUrl, TokenManager } from "../utils";
import * as Localization from "expo-localization";
import { AuroraSession, AuroraStream, AuroraEvent } from "../sdk/models";
import {
    AuroraProfile,
    AuroraSessionJson,
    AuroraStreamJson,
    AuroraEventJson
} from "../sdk/AuroraTypes";
import { EventIds } from "../sdk/AuroraConstants";
import { AuroraSessionDetail } from "../sdk/models/AuroraSessionDetail";

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

    public async getAuroraSessions(
        userId: string
    ): Promise<Array<AuroraSession>> {
        const response = await this.get(
            `users/${userId}/aurora-sessions?\$sort[session_at]=1`,
            {}
        );

        if (response.ok) {
            const result: Array<AuroraSessionJson> = await response.json();

            const auroraSessions = new Array<AuroraSession>();
            result.forEach((value: AuroraSessionJson) => {
                auroraSessions.push(new AuroraSession(value));
            });
            return auroraSessions;
        }
        throw await response.json();
    }

    public async getSessionStreams(
        sessionId: string
    ): Promise<Array<AuroraStream>> {
        const response = await this.get(
            `aurora-sessions/${sessionId}/streams`,
            {}
        );

        if (response.ok) {
            const result = await response.json();

            const auroraStreams = new Array<AuroraStream>();
            result.forEach((value: AuroraStreamJson) => {
                auroraStreams.push(new AuroraStream(value));
            });
            return auroraStreams;
        }
        throw await response.json();
    }

    public async getSessionEvents(sessionId: string): Promise<any> {
        const queries = {
            movementEvents: {
                bins: "0,5,10,15,20",
                aurora_event_id: EventIds.MOVEMENT_MONITOR,
                group_by: "average"
            },
            sleepEvents: {
                bins: "0,5,10,15,20,25",
                aurora_event_id: EventIds.SLEEP_TRACKER_MONITOR,
                group_by: "duration"
            },
            awakeningEvents: {
                bins: "0,15,30,45,60",
                aurora_event_id: EventIds.AWAKENING,
                group_by: "sum"
            },
            stimEvents: {
                bins: "0,15,30,45,60",
                aurora_event_id: EventIds.STIM_PRESENTED,
                group_by: "count"
            },
            buttonEvents: {
                bins: "0,15,30,45,60",
                aurora_event_id: EventIds.BUTTON_MONITOR,
                flags: 1,
                group_by: "sum"
            }
        };

        return Promise.all(
            Object.entries(queries).map(async ([eventIndex, eventQuery]) => {
                return this.get(
                    `aurora-sessions/${sessionId}/events`,
                    eventQuery
                ).then(async (response: Response) => {
                    const result = await response.json();

                    const auroraEvents = Array<AuroraEvent>();
                    result.forEach((value: AuroraEventJson) => {
                        auroraEvents.push(new AuroraEvent(value));
                    });

                    // @ts-ignore
                    queries[eventIndex] = auroraEvents;
                });
            })
        ).then(() => queries);
    }

    public async getSessionDetails(
        sessionId: string
    ): Promise<AuroraSessionDetail> {
        const streams = await this.getSessionStreams(sessionId);
        const events = await this.getSessionEvents(sessionId);

        const sessionDetail = new AuroraSessionDetail(
            sessionId,
            streams,
            events.awakeningEvents,
            events.buttonEvents,
            events.movementEvents,
            events.sleepEvents,
            events.stimEvents
        );

        console.debug("sessionDetail:", sessionDetail);
        return sessionDetail;
    }
}
const getToken = async (): Promise<string | undefined> => {
    return TokenManager.get() ? TokenManager.get() : undefined;
};
export default new AuroraRestClient(
    BaseUrl.get(),
    Localization.locale,
    getToken
);
