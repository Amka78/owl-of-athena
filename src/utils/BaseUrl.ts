import Constants from "expo-constants";

/**
 * Manage API-URL for each environment.
 *
 * @export
 * @class BaseUrl
 */
export default class BaseUrl {
    public static get(relCh?: string): string {
        if (!relCh && Constants.manifest.releaseChannel) {
            relCh = Constants.manifest.releaseChannel;
        }

        if (relCh !== undefined) {
            if (relCh!.includes("staging")) {
                return IWinksRestAPI.staging.url;
            } else if (relCh!.includes("prod")) {
                return IWinksRestAPI.prod.url;
            }
        }

        return IWinksRestAPI.dev.url;
    }
}

export const IWinksRestAPI = {
    dev: {
        url: "https://api.iwinks.io/",
    },
    staging: {
        url: "https://api-staging.iwinks.io/",
    },
    prod: {
        url: "https://api.iwinks.io/",
    },
};
