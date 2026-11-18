import { describe, expect, it, mock } from "bun:test";
import { Platform } from "react-native";

// bun では expo-notifications（内部で expo-modules-core の型宣言を runtime import する）を
// 実ロードできない。静的 import はモック登録より先に実モジュールを評価してしまうため、
// mock.module で差し替えた後、対象モジュールを動的 import で読み込む。
const setNotificationHandler = mock(() => {});
const getPermissionsAsync = mock(async () => ({ status: "granted" }));
const requestPermissionsAsync = mock(async () => ({ status: "granted" }));
const setNotificationChannelAsync = mock(async () => ({}));
const setNotificationCategoryAsync = mock(async () => undefined);
const scheduleNotificationAsync = mock(async () => "notification-id");
const cancelScheduledNotificationAsync = mock(async () => undefined);
const dismissNotificationAsync = mock(async () => undefined);
const addNotificationResponseReceivedListener = mock(() => () => undefined);
const getLastNotificationResponseAsync = mock(async () => null);
const clearLastNotificationResponseAsync = mock(async () => undefined);
const ANDROID_IMPORTANCE_MAX = 5;

mock.module("expo-notifications", () => ({
    setNotificationHandler,
    getPermissionsAsync,
    requestPermissionsAsync,
    setNotificationChannelAsync,
    setNotificationCategoryAsync,
    scheduleNotificationAsync,
    cancelScheduledNotificationAsync,
    dismissNotificationAsync,
    addNotificationResponseReceivedListener,
    getLastNotificationResponseAsync,
    clearLastNotificationResponseAsync,
    AndroidImportance: { MAX: ANDROID_IMPORTANCE_MAX },
    SchedulableTriggerInputTypes: { DATE: "date" },
    DEFAULT_ACTION_IDENTIFIER: "expo.modules.notifications.actions.DEFAULT",
}));

const { default: AlarmNotifier } = await import("../AlarmNotifier.native");

const setPlatformOS = (os: string): (() => void) => {
    const original = Platform.OS;
    (Platform as { OS: string }).OS = os;
    return () => {
        (Platform as { OS: string }).OS = original;
    };
};

describe("AlarmNotifier (native)", () => {
    it("Android のチャンネルに sound を渡さない（システム標準音を使う）", async () => {
        const restore = setPlatformOS("android");
        try {
            await AlarmNotifier.prepare();

            expect(setNotificationChannelAsync).toHaveBeenCalledTimes(1);
            const [channelId, options] = setNotificationChannelAsync.mock.calls[0];
            expect(channelId).toBe("alarm");
            expect(options).not.toHaveProperty("sound");
            expect(options.importance).toBe(ANDROID_IMPORTANCE_MAX);
        } finally {
            restore();
        }
    });

    it("通知 content の sound は iOS だけに付き、Android には付かない", async () => {
        const restore = setPlatformOS("ios");
        try {
            await AlarmNotifier.notify();
        } finally {
            restore();
        }

        setPlatformOS("android");
        try {
            await AlarmNotifier.notify();
        } finally {
            restore();
        }

        const scheduledCalls = scheduleNotificationAsync.mock.calls as Array<
            [{ content: Record<string, unknown> }]
        >;
        expect(scheduledCalls[0][0].content.sound).toBe("default");
        expect(scheduledCalls[1][0].content).not.toHaveProperty("sound");
        expect(scheduledCalls[1][0].content.channelId).toBe("alarm");
    });
});
