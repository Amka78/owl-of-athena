import { ExpoConfig, ConfigContext } from "@expo/config";
import { Colors } from "./src/constants";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "Owl of Athena",
    slug: "owl-of-athena",
    owner: "A-Mikaboshi",
    privacy: "hidden",
    platforms: ["ios", "android", "web"],
    githubUrl: "https://github.com/Amka78/owl-of-athena",
    icon: "./assets/images/icon.png",
    version: "1.0.0",
    orientation: "default",
    updates: {
        fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
        supportsTablet: true,
    },
    description: "Aurora Client for community user.",
    backgroundColor: Colors.navy_darker,
    splash: {
        resizeMode: "cover",
        backgroundColor: Colors.navy_darker,
        image: "./assets/images/iwinks-logo-loading.png",
    },
});
