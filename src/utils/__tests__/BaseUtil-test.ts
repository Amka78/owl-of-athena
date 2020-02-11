import Constants from "expo-constants";

import { BaseUrl } from "../";
import { IWinksRestAPI } from "../BaseUrl";

describe("BaseUtil Test", () => {
    it.each([
        [undefined, IWinksRestAPI.dev.url],
        ["dev", IWinksRestAPI.dev.url],
        ["staging", IWinksRestAPI.staging.url],
        ["prod", IWinksRestAPI.prod.url],
        ["xxx", IWinksRestAPI.dev.url]
    ])(
        "Able to obtain the Rest-API server corresponding to the release channel",
        // @ts-ignore
        async (testManifestReleaseChannel: string, testRestApiURL: string) => {
            Constants.manifest.releaseChannel = testManifestReleaseChannel;

            expect(BaseUrl.get()).toBe(testRestApiURL);
        }
    );

    it.each([
        ["dev", IWinksRestAPI.dev.url],
        ["staging", IWinksRestAPI.staging.url],
        ["prod", IWinksRestAPI.prod.url],
        [undefined, IWinksRestAPI.dev.url],
        ["staging-XXX", IWinksRestAPI.staging.url],
        ["prod-XXX", IWinksRestAPI.prod.url]
    ])(
        "if the release channel is set dev, connect to the local server.",
        // @ts-ignore
        async (getArgs: string, testRestApiURL: string) => {
            Constants.manifest.releaseChannel = "dev";
            expect(BaseUrl.get(getArgs)).toBe(testRestApiURL);
        }
    );
});
