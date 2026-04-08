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
        infoPlist: {
            NSBluetoothAlwaysUsageDescription:
                "Bluetooth is required to connect to the Aurora sleep headband.",
            NSBluetoothPeripheralUsageDescription:
                "Bluetooth is required to connect to the Aurora sleep headband.",
        },
    },
    android: {
        package: "com.amikaboshi.owlofathena",
        permissions: [
            "android.permission.BLUETOOTH",
            "android.permission.BLUETOOTH_ADMIN",
            "android.permission.BLUETOOTH_SCAN",
            "android.permission.BLUETOOTH_CONNECT",
            "android.permission.ACCESS_FINE_LOCATION",
        ],
    },
    extra: {
        supabaseUrl: process.env.SUPABASE_URL ?? "",
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",
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
            "react-native-ble-plx",
            {
                isBackgroundEnabled: false,
                modes: ["peripheral", "central"],
                bluetoothAlwaysPermission:
                    "Bluetooth is required to connect to the Aurora sleep headband.",
            },
        ],
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
