import { Platform } from "react-native";
import { describe, expect, it, vi } from "vitest";

// vitest では expo-notifications（内部で expo-modules-core の型宣言を runtime import する）を
// 実ロードできない。静的 import はモック登録より先に実モジュールを評価してしまうため、
// vi.mock（top-level hoisting される）で差し替えた後、対象モジュールを動的 import で読み込む。
const {
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
} = vi.hoisted(() => ({
    setNotificationHandler: vi.fn(() => {}),
    getPermissionsAsync: vi.fn(async () => ({ status: "granted" })),
    requestPermissionsAsync: vi.fn(async () => ({ status: "granted" })),
    setNotificationChannelAsync: vi.fn(
        async (_channelId: string, _options: Record<string, unknown>) => ({}),
    ),
    setNotificationCategoryAsync: vi.fn(async () => undefined),
    scheduleNotificationAsync: vi.fn(
        async (_content: Record<string, unknown>) => "notification-id",
    ),
    cancelScheduledNotificationAsync: vi.fn(async () => undefined),
    dismissNotificationAsync: vi.fn(async () => undefined),
    addNotificationResponseReceivedListener: vi.fn(() => () => undefined),
    getLastNotificationResponseAsync: vi.fn(async () => null),
    clearLastNotificationResponseAsync: vi.fn(async () => undefined),
}));
const ANDROID_IMPORTANCE_MAX = 5;

vi.mock("expo-notifications", () => ({
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
