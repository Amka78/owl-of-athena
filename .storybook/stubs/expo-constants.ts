// Web stub for expo-constants: the browser test environment has no app
// config injected, so Constants.expoConfig is undefined and services that
// read SUPABASE_URL/SUPABASE_ANON_KEY throw "Supabase is not configured".
// Supply the same test values as setup/react-native-mock.ts.
const Constants = {
    expoConfig: {
        name: "owl-of-athena",
        slug: "owl-of-athena",
        extra: {
            channel: undefined as string | undefined,
            supabaseUrl: "https://test.supabase.co",
            supabaseAnonKey: "test-anon-key",
        },
    },
    manifest: null,
    manifest2: null,
    appOwnership: null,
    executionEnvironment: "storeClient",
    isDevice: false,
    sessionId: "test-session-id",
    systemVersion: "14.0",
    systemFonts: [],
    statusBarHeight: 20,
    deviceName: "iPhone",
    platform: { ios: { buildNumber: "1" } },
};

export default Constants;
export { Constants };
