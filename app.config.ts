import type { ConfigContext, ExpoConfig } from "@expo/config";

// app.config は Node で直接読み込まれるため、src 配下の TS は import できない
const NAVY_DARKER = "#09092B";

/** app.json の extra.eas.projectId と同一。updates.url の組み立てに使う。 */
const EAS_PROJECT_ID = "a088b24d-82f1-4459-9936-447d64392502";

/** eas.json の各プロファイルが APP_VARIANT を設定する。既定は production（接尾辞なし）。 */
const APP_VARIANT = process.env.APP_VARIANT ?? "production";
const APP_NAME_SUFFIX =
    APP_VARIANT === "development" ? " Dev" : APP_VARIANT === "preview" ? " Preview" : "";
const APP_ID_SUFFIX =
    APP_VARIANT === "development" ? ".dev" : APP_VARIANT === "preview" ? ".preview" : "";

/**
 * app.json の値を土台に、ネイティブ側の設定（バックグラウンド実行・Bluetooth）を足す。
 * アプリ識別子は既存インストールを壊さないよう app.json の値を引き継ぎ、
 * development / preview だけ接尾辞を付けて production と併存できるようにする。
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    // app.json に未設定のため、現在使われている package.json 由来の名前を明示する
    name: `${config.name ?? "owl-of-minerva"}${APP_NAME_SUFFIX}`,
    slug: config.slug ?? "owl-of-minerva",
    // パスワード再設定メールの戻り先。ネイティブビルドに埋め込まれるため、変更には再ビルドが必要。
    scheme: "owl-of-athena",
    platforms: ["ios", "android", "web"],
    githubUrl: "https://github.com/Amka78/owl-of-athena",
    // EAS Update の配信先。どのチャンネルへ届くかはビルド時の eas.json の channel が決める。
    updates: {
        url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
        // 取得した更新は次回起動時に適用する（起動を待たせない）
        fallbackToCacheTimeout: 0,
    },
    runtimeVersion: {
        // SDK を上げるまで、同じネイティブビルドへ OTA を配信できるようにする。
        // appVersion だと eas.json の appVersionSource: remote とバンドル側の version がずれやすい。
        policy: "sdkVersion",
    },
    icon: "./assets/images/icon.png",
    orientation: "default",
    assetBundlePatterns: ["**/*"],
    ios: {
        ...config.ios,
        supportsTablet: true,
        // app.json では未設定のため、Android と同じ識別子を使う
        bundleIdentifier: `${config.ios?.bundleIdentifier ?? "com.amka78.owlofminerva"}${APP_ID_SUFFIX}`,
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
        package: `${config.android?.package ?? "com.amka78.owlofminerva"}${APP_ID_SUFFIX}`,
        permissions: [
            "android.permission.BLUETOOTH",
            "android.permission.BLUETOOTH_ADMIN",
            "android.permission.BLUETOOTH_SCAN",
            "android.permission.BLUETOOTH_CONNECT",
            "android.permission.ACCESS_FINE_LOCATION",
            "android.permission.POST_NOTIFICATIONS",
            // Doze 中でも締切時刻ちょうどに通知を出せるよう、正確なアラームを予約する。
            // アラームアプリ向けの権限で、インストール時に自動許可される。
            "android.permission.USE_EXACT_ALARM",
        ],
    },
    extra: {
        ...config.extra,
        // クライアントへ埋め込むのは EXPO_PUBLIC_* のみ。
        // SUPABASE_* は .env に secret キーが入っており、バンドルへ漏れる経路になるため参照しない。
        supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
        supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
    },
    description: "Aurora Client for community user.",
    backgroundColor: NAVY_DARKER,
    plugins: [
        "expo-dev-client",
        "expo-notifications",
        "expo-sharing",
        [
            "expo-image-picker",
            {
                photosPermission:
                    "Allow $(PRODUCT_NAME) to access your photos to attach screenshots to issue reports.",
            },
        ],
        // バックグラウンド再生用の前景サービスと UIBackgroundModes を有効にする。
        // 録音は使わないため RECORD_AUDIO は要求しない。
        [
            "expo-audio",
            {
                recordAudioAndroid: false,
                microphonePermission:
                    "Allow $(PRODUCT_NAME) to access your microphone (not used by Aurora).",
            },
        ],
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
