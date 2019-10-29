export default class RestClient {
    protected headers: any = null;

    private baseUrl: string = "";

    private devMode: boolean = false;

    private simulatedDelay = 0;

    constructor(
        baseUrl: string = "",
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

    public setToken(token: string) {
        Object.assign(this.headers, this.headers, {
            Authorization: `Bearer ${token}`
        });
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

    private createCommonHeader() {
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
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
        isQuery: boolean = false
    ): Promise<Response> {
        if (!route) {
            throw new Error("Route is undefined");
        }

        let fullRoute = this.createFullRoute(route);

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
