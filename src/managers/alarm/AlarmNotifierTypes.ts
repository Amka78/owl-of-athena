//#region Types
export type AlarmNotificationAction = "snooze" | "wakeup" | "open";

/**
 * 鳴動を知らせ、通知から直接スヌーズ・起床できるようにするための層。
 * 実装はプラットフォームごとに異なる（native: expo-notifications / web: Notification API）。
 */
export type AlarmNotifier = {
    /** 権限の要求と、カテゴリ・チャンネルの登録。 */
    prepare: () => Promise<void>;
    notify: () => Promise<void>;
    cancel: () => Promise<void>;
    subscribe: (handler: (action: AlarmNotificationAction) => void) => () => void;
};
//#endregion
