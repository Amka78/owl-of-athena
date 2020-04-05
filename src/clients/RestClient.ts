export default class RestClient {
    protected headers: any = null;

    protected onGetToken?: () => Promise<string | undefined>;

    private baseUrl = "";

    private devMode = false;

    private simulatedDelay = 0;

    constructor(
        baseUrl = "",
        { headers = {}, devMode = false, simulatedDelay = 0 } = {}
    ) {
        if (!baseUrl) {
            throw new Error("missing baseUrl");
        }

        this.createCommonHeader();

        Object.assign(this.headers, headers);
        this.baseUrl = baseUrl;
        this.simulatedDelay = simulatedDelay;
        this.devMode = devMode;
    }

    /**
     * Call Get method of Rest API.
     *
     * @protected
     * @template T
     * @template K
     * @param {string} route
     * @param {T} query
     * @returns {Promise<K>}
     * @memberof RestClient
     */
    protected async get<T>(route: string, query: T): Promise<Response> {
        return await this.fetch(route, "GET", query, true);
    }

    /**
     * Call Post method of Rest API.
     *
     * @protected
     * @template T
     * @template K
     * @param {string} route
     * @param {T} body
     * @returns {Promise<K>}
     * @memberof RestClient
     */
    protected async post<T>(route: string, body: T): Promise<Response> {
        return await this.fetch(route, "POST", body);
    }

    /**
     * Call Put method of Rest API.
     *
     * @protected
     * @template T
     * @template K
     * @param {string} route
     * @param {T} body
     * @returns {Promise<K>}
     * @memberof RestClient
     */
    protected async put<T>(route: string, body: T): Promise<Response> {
        return await this.fetch(route, "PUT", body);
    }

    /**
     * Call Delete method of Rest API.
     *
     * @protected
     * @template T
     * @template K
     * @param {string} route
     * @param {T} body
     * @returns {Promise<K>}
     * @memberof RestClient
     */
    protected async delete<T>(route: string, query: T): Promise<Response> {
        return await this.fetch(route, "DELETE", query, true);
    }

    private setTokenToHeader(token: string): void {
        Object.assign(this.headers, this.headers, {
            Authorization: `Bearer ${token}`
        });
    }

    private createCommonHeader(): void {
        this.headers = {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json;charset=UTF-8"
        };
    }

    private createSimulateDelay(): Promise<[]> {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, this.simulatedDelay);
        });
    }

    /**
     * Create a full URL from arguments.
     *
     * @private
     * @param {string} url
     * @returns {string}
     * @memberof RestClient
     */
    private createFullRoute(url: string): string {
        return `${this.baseUrl}${url}`;
    }

    private async fetch<T>(
        route: string,
        methodName: string,
        sendData: T,
        isQuery = false
    ): Promise<Response> {
        if (!route) {
            throw new Error("Route is undefined");
        }

        let fullRoute = this.createFullRoute(route);

        if (this.onGetToken) {
            const result = await this.onGetToken();
            if (result) {
                this.setTokenToHeader(result);
            }
        }

        const opts = {
            headers: this.headers,
            method: methodName
        };

        if (isQuery && sendData) {
            const qs = require("qs");
            const query = qs.stringify(sendData);
            fullRoute = `${fullRoute}?${query}`;
        } else if (sendData) {
            Object.assign(opts, { body: JSON.stringify(sendData) });
        }

        if (this.devMode && this.simulatedDelay > 0) {
            // Simulate an n-second delay in every request
            await this.createSimulateDelay();
        }

        return await fetch(fullRoute, opts);
    }
}
