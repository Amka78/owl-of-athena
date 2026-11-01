//#region Types
export type AlarmNotificationAction = "snooze" | "wakeup" | "open";

/**
 * 鳴動を知らせ、通知から直接スヌーズ・起床できるようにするための層。
 * 実装はプラットフォームごとに異なる（native: expo-notifications / web: Notification API）。
 */
export type AlarmNotifier = {
    /** 権限の要求と、カテゴリ・チャンネルの登録。 */
    prepare: () => Promise<void>;
    /**
     * 締切時刻での通知を OS に予約する。
     * JS のタイマーが Doze やタブのスロットリングで止まっても、OS 側で時刻に発報させるため。
     */
    scheduleAt: (targetEpochMs: number) => Promise<void>;
    /** 予約済みの通知を取り消す（鳴動・スヌーズ・起床のたびに呼び直す）。 */
    cancelScheduled: () => Promise<void>;
    notify: () => Promise<void>;
    cancel: () => Promise<void>;
    subscribe: (handler: (action: AlarmNotificationAction) => void) => () => void;
    /**
     * 通知の操作でアプリが起動した場合、その操作を取り出す。
     * 起動時はリスナー登録より先に応答が届くため、購読だけでは取りこぼす。
     */
    consumePendingAction: () => Promise<AlarmNotificationAction | undefined>;
};
//#endregion
