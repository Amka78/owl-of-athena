import Constants from "expo-constants";
import { Platform } from "react-native";

export type AppInfo = {
    name: string;
    version: string;
    build: string;
    sdkVersion: string;
    platform: string;
    osVersion: string;
    description: string;
    repositoryUrl: string;
};

export const getAppInfo = (): AppInfo => {
    const config = Constants.expoConfig;

    const build =
        Platform.OS === "ios"
            ? config?.ios?.buildNumber
            : Platform.OS === "android"
              ? config?.android?.versionCode?.toString()
              : undefined;

    return {
        name: config?.name ?? "Aurora",
        version: config?.version ?? "unknown",
        build: build ?? "—",
        sdkVersion: config?.sdkVersion ?? "—",
        platform: Platform.OS,
        osVersion: String(Platform.Version ?? Constants.systemVersion ?? "—"),
        description: config?.description ?? "",
        repositoryUrl: config?.githubUrl ?? "",
    };
};
