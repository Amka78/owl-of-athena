//#region Import Modules
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { Message, MessageKeys } from "../../constants";
import type { AlarmNotificationAction, AlarmNotifier } from "./AlarmNotifierTypes";

//#endregion

//#region Constants
const CHANNEL_ID = "alarm";
const CATEGORY_ID = "alarm";
const SNOOZE_ACTION_ID = "snooze";
const WAKEUP_ACTION_ID = "wakeup";
/**
 * 締切通知の識別子。固定値にして、アプリを再起動しても
 * （expo-notifications が予約を永続化していても）同じ 1 件を差し替えられるようにする。
 */
const SCHEDULED_ID = "aurora-alarm-deadline";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});
//#endregion

//#region Class
/**
 * iOS/Android 用。expo-notifications で鳴動を知らせ、
 * 通知の Snooze / Wake Up アクションを AlarmRuntime に渡す。
 */
class NativeAlarmNotifier implements AlarmNotifier {
    private prepared = false;
    private handler?: (action: AlarmNotificationAction) => void;
    private subscription?: Notifications.EventSubscription;
    private notificationId?: string;
    private pendingActionConsumed = false;

    public async prepare(): Promise<void> {
        if (this.prepared) return;

        try {
            const permission = await Notifications.getPermissionsAsync();
            if (permission.status !== "granted") {
                await Notifications.requestPermissionsAsync({
                    ios: { allowAlert: true, allowSound: true, allowBadge: false },
                });
            }

            if (Platform.OS === "android") {
                await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
                    name: Message.get(MessageKeys.alarm_notification_title),
                    importance: Notifications.AndroidImportance.MAX,
                    sound: "default",
                    vibrationPattern: [0, 250, 250, 250],
                });
            }

            await Notifications.setNotificationCategoryAsync(CATEGORY_ID, [
                {
                    identifier: SNOOZE_ACTION_ID,
                    buttonTitle: Message.get(MessageKeys.alarm_notification_snooze),
                },
                {
                    identifier: WAKEUP_ACTION_ID,
                    buttonTitle: Message.get(MessageKeys.alarm_notification_wakeup),
                },
            ]);
            this.prepared = true;
        } catch (e) {
            console.error("[AlarmNotifier] failed to prepare notifications:", e);
        }
    }

    /**
     * 予約した通知は締切時刻に OS が出すため、JS が Doze で止まっていても発報する。
     * Android は setExactAndAllowWhileIdle 相当（expo-notifications 側）で予約される。
     */
    public async scheduleAt(targetEpochMs: number): Promise<void> {
        await this.cancelScheduled();
        if (targetEpochMs <= Date.now()) return;

        try {
            await Notifications.scheduleNotificationAsync({
                identifier: SCHEDULED_ID,
                content: this.buildContent(),
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: targetEpochMs,
                    ...(Platform.OS === "android" ? { channelId: CHANNEL_ID } : {}),
                },
            });
        } catch (e) {
            console.error("[AlarmNotifier] failed to schedule the alarm notification:", e);
        }
    }

    public async cancelScheduled(): Promise<void> {
        try {
            await Notifications.cancelScheduledNotificationAsync(SCHEDULED_ID);
        } catch (e) {
            console.error("[AlarmNotifier] failed to cancel the scheduled notification:", e);
        }

        // すでに配信済みだと cancel では消えないため、表示中のものも閉じる
        try {
            await Notifications.dismissNotificationAsync(SCHEDULED_ID);
        } catch {
            // 未配信なら dismiss 対象が無いだけなので無視する
        }
    }

    public async notify(): Promise<void> {
        // 予約分と即時表示が二重に出ないよう、先に予約を取り消す
        await this.cancelScheduled();

        try {
            this.notificationId = await Notifications.scheduleNotificationAsync({
                content: this.buildContent(),
                trigger: null,
            });
        } catch (e) {
            console.error("[AlarmNotifier] failed to show the alarm notification:", e);
        }
    }

    public async cancel(): Promise<void> {
        if (this.notificationId === undefined) return;
        const notificationId = this.notificationId;
        this.notificationId = undefined;
        try {
            await Notifications.dismissNotificationAsync(notificationId);
        } catch (e) {
            console.error("[AlarmNotifier] failed to dismiss the alarm notification:", e);
        }
    }

    public subscribe(handler: (action: AlarmNotificationAction) => void): () => void {
        this.handler = handler;
        this.subscription?.remove();
        this.subscription = Notifications.addNotificationResponseReceivedListener((response) => {
            const action = this.toAction(response.actionIdentifier);
            if (action !== undefined) this.handler?.(action);
        });
        return () => {
            this.subscription?.remove();
            this.subscription = undefined;
            this.handler = undefined;
        };
    }

    /**
     * 通知の操作でアプリがコールドスタートした場合、リスナー登録前に応答が届いているため
     * 直近の応答を読み出す。読み出し後は消して、次回起動時に再生されないようにする。
     */
    public async consumePendingAction(): Promise<AlarmNotificationAction | undefined> {
        if (this.pendingActionConsumed) return undefined;
        this.pendingActionConsumed = true;

        try {
            const response = await Notifications.getLastNotificationResponseAsync();
            await Notifications.clearLastNotificationResponseAsync();
            if (response === null || response === undefined) return undefined;
            return this.toAction(response.actionIdentifier);
        } catch (e) {
            console.error("[AlarmNotifier] failed to read the last notification response:", e);
            return undefined;
        }
    }

    private buildContent(): Notifications.NotificationContentInput {
        return {
            title: Message.get(MessageKeys.alarm_notification_title),
            body: Message.get(MessageKeys.alarm_notification_body),
            categoryIdentifier: CATEGORY_ID,
            sound: "default",
            ...(Platform.OS === "android" ? { channelId: CHANNEL_ID } : {}),
        };
    }

    private toAction(actionIdentifier: string): AlarmNotificationAction | undefined {
        if (actionIdentifier === SNOOZE_ACTION_ID) return "snooze";
        if (actionIdentifier === WAKEUP_ACTION_ID) return "wakeup";
        if (actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) return "open";
        return undefined;
    }
}
//#endregion

//#region Export
export default new NativeAlarmNotifier();
//#endregion
