import RestClient from "./RestClient";

import { BaseUrl } from "../utils";
import * as Localization from "expo-localization";
import {
    AuroraSession,
    AuroraSessionDetail,
    AuroraStream,
    AuroraEvent,
} from "../sdk/models";
import {
    AuroraSessionJson,
    AuroraStreamJson,
    AuroraEventJson,
} from "../sdk/AuroraTypes";
import { EventIds } from "../sdk/AuroraConstants";

/**
 * Managing session-related RestAPI communication
 *
 * @export
 * @class SessionRestClient
 * @extends {RestClient}
 */
export class SessionRestClient extends RestClient {
    constructor(baseUrl: string, locale: string) {
        super(baseUrl, {
            headers: {
                "Accept-Language": locale,
            },
        });
    }

    /**
     * Register a session.
     *
     * @param {AuroraSessionJson} sessionJson
     * @returns {Promise<AuroraSession>}
     * @memberof SessionRestClient
     */
    public async create(
        sessionJson: AuroraSessionJson
    ): Promise<AuroraSession> {
        const response = await this.post(
            "users/me/aurora-sessions",
            sessionJson
        );

        if (response.ok) {
            return new AuroraSession(await response.json());
        }
        throw await response.json();
    }

    /**
     * Get your own session.
     *
     * @param {string} userId
     * @returns {Promise<Array<AuroraSession>>}
     * @memberof SessionRestClient
     */
    public async getAll(userId: string): Promise<Array<AuroraSession>> {
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
            return auroraSessions.reverse();
        }
        throw await response.json();
    }

    /**
     * Get the session of the specified ID.
     *
     * @param {string} sessionId
     * @returns {Promise<AuroraSession>}
     * @memberof SessionRestClient
     */
    public async getById(sessionId: string): Promise<AuroraSession> {
        const response = await this._getById(sessionId);

        if (response.ok) {
            return new AuroraSession(await response.json());
        }
        throw await response.json();
    }

    /**
     * Get the stream of the specified session.
     *
     * @param sessionId
     */
    public async getStreams(sessionId: string): Promise<Array<AuroraStream>> {
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

    /**
     * Get the events of the specified session.
     *
     * @param {string} sessionId
     * @returns {Promise<any>}
     * @memberof SessionRestClient
     */
    public async getEvents(sessionId: string): Promise<any> {
        const queries = {
            movementEvents: {
                bins: "0,5,10,15,20",
                aurora_event_id: EventIds.MOVEMENT_MONITOR,
                group_by: "average",
            },
            sleepEvents: {
                bins: "0,5,10,15,20,25",
                aurora_event_id: EventIds.SLEEP_TRACKER_MONITOR,
                group_by: "duration",
            },
            awakeningEvents: {
                bins: "0,15,30,45,60",
                aurora_event_id: EventIds.AWAKENING,
                group_by: "sum",
            },
            stimEvents: {
                bins: "0,15,30,45,60",
                aurora_event_id: EventIds.STIM_PRESENTED,
                group_by: "count",
            },
            buttonEvents: {
                bins: "0,15,30,45,60",
                aurora_event_id: EventIds.BUTTON_MONITOR,
                flags: 1,
                group_by: "sum",
            },
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

    /**
     * Get the detailed information of the specified session.
     *
     * @param {string} sessionId
     * @returns {Promise<AuroraSessionDetail>}
     * @memberof SessionRestClient
     */
    public async getDetailsById(
        sessionId: string
    ): Promise<AuroraSessionDetail> {
        const streams = await this.getStreams(sessionId);
        const events = await this.getEvents(sessionId);

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

    /**
     * Get the session of the specified ID.
     *
     * @param {string} sessionId
     * @returns {Promise<AuroraSession>}
     * @memberof SessionRestClient
     */
    public async deleteById(sessionId: string): Promise<void> {
        const response = await this.delete(
            `users/me/aurora-sessions/${sessionId}`,
            {}
        );

        if (response.ok) {
            return;
        }
        throw await response.json();
    }

    /**
     * Sessoin update process
     *
     * @param {string} sessionId
     * @param {AuroraSessionJson} updateInfo
     * @returns {Promise<void>}
     * @memberof SessionRestClient
     */
    public async updateById(
        sessionId: string,
        updateInfo: Partial<AuroraSessionJson>
    ): Promise<void> {
        const getResponse = await this._getById(sessionId);

        if (!getResponse.ok) {
            throw getResponse.json;
        }

        const updatedJson = Object.assign(getResponse.json(), updateInfo);

        const patchResponse = await this.patch(
            this.getRoute(sessionId),
            updatedJson
        );

        if (patchResponse.ok) {
            return patchResponse.json();
        }

        throw patchResponse.json();
    }

    /**
     * Internal session retrieval process
     *
     * @private
     * @param {string} sessionId
     * @returns {Promise<Response>}
     * @memberof SessionRestClient
     */
    private async _getById(sessionId: string): Promise<Response> {
        return await this.get(this.getRoute(sessionId), {});
    }

    /**
     * Get the RouteURL of the session.
     *
     * @private
     * @param {string} sessionId
     * @returns {string}
     * @memberof SessionRestClient
     */
    private getRoute(sessionId: string): string {
        return `users/me/aurora-sessions/${sessionId}`;
    }
}
export default new SessionRestClient(BaseUrl.get(), Localization.locale);
