import Constants from "expo-constants";

/**
 * Manage API-URL for each environment.
 *
 * @export
 * @class BaseUrl
 */
export default class BaseUrl {
    public static get(relCh?: string) {
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

    public static getDownloadUrl(
        image: string | string[],
        index?: number
    ): string | undefined {
        if (typeof image === "undefined") {
            return undefined;
        } else if (typeof image === "string") {
            return BaseUrl.get() + image;
        } else {
            if (index === undefined) {
                index = 0;
            }
            return BaseUrl.get() + image![index];
        }
    }
}

export const IWinksRestAPI = {
    dev: {
        url: "https://api.iwinks.io/"
    },
    staging: {
        url: "https://api.iwinks.io/"
    },
    prod: {
        url: "https://api.iwinks.io/"
    }
};
