import Constants from "expo-constants";

import { BaseUrl } from "../";
import { AracanRestAPI } from "../BaseUrl";

describe("BaseUtil Test", () => {
    it.each([
        [undefined, AracanRestAPI.dev.url],
        ["dev", AracanRestAPI.dev.url],
        ["staging", AracanRestAPI.staging.url],
        ["prod", AracanRestAPI.prod.url],
        ["xxx", AracanRestAPI.dev.url]
    ])(
        "Able to obtain the Rest-API server corresponding to the release channel",
        // @ts-ignore
        async (testManifestReleaseChannel: string, testRestApiURL: string) => {
            Constants.manifest.releaseChannel = testManifestReleaseChannel;

            expect(BaseUrl.get()).toBe(testRestApiURL);
        }
    );

    it.each([
        ["dev", AracanRestAPI.dev.url],
        ["staging", AracanRestAPI.staging.url],
        ["prod", AracanRestAPI.prod.url],
        [undefined, AracanRestAPI.dev.url],
        ["staging-XXX", AracanRestAPI.staging.url],
        ["prod-XXX", AracanRestAPI.prod.url]
    ])(
        "if the release channel is set dev, connect to the local server.",
        // @ts-ignore
        async (getArgs: string, testRestApiURL: string) => {
            Constants.manifest.releaseChannel = "dev";
            expect(BaseUrl.get(getArgs)).toBe(testRestApiURL);
        }
    );
});
