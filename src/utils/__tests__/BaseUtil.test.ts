//#region Import modules
import Constants from "expo-constants";

import { BaseUrl } from "../";
import { IWinksRestAPI } from "../BaseUrl";

//#endregion

describe("BaseUtil Test", () => {
    it.each([
        [undefined, IWinksRestAPI.dev.url],
        ["dev", IWinksRestAPI.dev.url],
        ["staging", IWinksRestAPI.staging.url],
        ["prod", IWinksRestAPI.prod.url],
        ["xxx", IWinksRestAPI.dev.url],
    ])("Able to obtain the Rest-API server corresponding to the release channel", async (testManifestReleaseChannel: string, testRestApiURL: string) => {
        // @ts-expect-error
        (Constants.expoConfig as any).extra = { channel: testManifestReleaseChannel };

        expect(BaseUrl.get()).toBe(testRestApiURL);
    });

    it.each([
        ["dev", IWinksRestAPI.dev.url],
        ["staging", IWinksRestAPI.staging.url],
        ["prod", IWinksRestAPI.prod.url],
        [undefined, IWinksRestAPI.dev.url],
        ["staging-XXX", IWinksRestAPI.staging.url],
        ["prod-XXX", IWinksRestAPI.prod.url],
    ])("if the release channel is set dev, connect to the local server.", async (getArgs: string, testRestApiURL: string) => {
        // @ts-expect-error
        (Constants.expoConfig as any).extra = { channel: "dev" };
        expect(BaseUrl.get(getArgs)).toBe(testRestApiURL);
    });
});
