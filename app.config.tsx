import { ExpoConfig, ConfigContext } from "@expo/config";
import { Colors } from "./src/constants";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "Owl of Athena",
    slug: "owl-of-athena",
    owner: "A-Mikaboshi",
    platforms: ["ios", "android", "web"],
    githubUrl: "https://github.com/Amka78/owl-of-athena",
    icon: "./assets/images/icon.png",
    version: "1.0.0",
    orientation: "default",
    runtimeVersion: {
        policy: "appVersion",
    },
    updates: {
        url: "https://u.expo.dev/owl-of-athena",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
        supportsTablet: true,
        bundleIdentifier: "com.amikaboshi.owlofathena",
    },
    android: {
        package: "com.amikaboshi.owlofathena",
    },
    description: "Aurora Client for community user.",
    backgroundColor: Colors.navy_darker,
    splash: {
        resizeMode: "cover",
        backgroundColor: Colors.navy_darker,
        image: "./assets/images/iwinks-logo-loading.png",
    },
    plugins: [
        "expo-dev-client",
        [
            "expo-splash-screen",
            {
                backgroundColor: Colors.navy_darker,
                image: "./assets/images/iwinks-logo-loading.png",
                resizeMode: "cover",
            },
        ],
    ],
});
