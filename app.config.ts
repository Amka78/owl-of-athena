import type { ConfigContext, ExpoConfig } from "@expo/config";

// app.config は Node で直接読み込まれるため、src 配下の TS は import できない
const NAVY_DARKER = "#09092B";

/**
 * app.json の値を土台に、ネイティブ側の設定（バックグラウンド実行・Bluetooth）を足す。
 * アプリ識別子は既存インストールを壊さないよう app.json の値を引き継ぐ。
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    // app.json に未設定のため、現在使われている package.json 由来の名前を明示する
    name: config.name ?? "owl-of-minerva",
    slug: config.slug ?? "owl-of-minerva",
    platforms: ["ios", "android", "web"],
    githubUrl: "https://github.com/Amka78/owl-of-athena",
    icon: "./assets/images/icon.png",
    orientation: "default",
    assetBundlePatterns: ["**/*"],
    ios: {
        ...config.ios,
        supportsTablet: true,
        // app.json では未設定のため、Android と同じ識別子を使う
        bundleIdentifier: config.ios?.bundleIdentifier ?? "com.amka78.owlofminerva",
        infoPlist: {
            ...config.ios?.infoPlist,
            NSBluetoothAlwaysUsageDescription:
                "Bluetooth is required to connect to the Aurora sleep headband.",
            NSBluetoothPeripheralUsageDescription:
                "Bluetooth is required to connect to the Aurora sleep headband.",
            // 夜間のあいだアプリを生かし、Bluetooth 切断時もアラームを鳴らすため
            UIBackgroundModes: ["audio", "bluetooth-central"],
        },
    },
    android: {
        ...config.android,
        package: config.android?.package ?? "com.amka78.owlofminerva",
        permissions: [
            "android.permission.BLUETOOTH",
            "android.permission.BLUETOOTH_ADMIN",
            "android.permission.BLUETOOTH_SCAN",
            "android.permission.BLUETOOTH_CONNECT",
            "android.permission.ACCESS_FINE_LOCATION",
            "android.permission.POST_NOTIFICATIONS",
        ],
    },
    extra: {
        ...config.extra,
        // クライアントに埋め込むのは EXPO_PUBLIC_* を優先する（SUPABASE_* は別用途の値を含むため）
        supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "",
        supabaseAnonKey:
            process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? "",
    },
    description: "Aurora Client for community user.",
    backgroundColor: NAVY_DARKER,
    splash: {
        resizeMode: "cover",
        backgroundColor: NAVY_DARKER,
        image: "./assets/images/iwinks-logo-loading.png",
    },
    plugins: [
        "expo-dev-client",
        "expo-notifications",
        [
            "react-native-ble-plx",
            {
                isBackgroundEnabled: true,
                modes: ["central"],
                bluetoothAlwaysPermission:
                    "Bluetooth is required to connect to the Aurora sleep headband.",
            },
        ],
        [
            "expo-splash-screen",
            {
                backgroundColor: NAVY_DARKER,
                image: "./assets/images/iwinks-logo-loading.png",
                resizeMode: "cover",
            },
        ],
    ],
});
