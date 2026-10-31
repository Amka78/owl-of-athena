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

    public async notify(): Promise<void> {
        try {
            this.notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: Message.get(MessageKeys.alarm_notification_title),
                    body: Message.get(MessageKeys.alarm_notification_body),
                    categoryIdentifier: CATEGORY_ID,
                    sound: "default",
                    ...(Platform.OS === "android" ? { channelId: CHANNEL_ID } : {}),
                },
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
            const actionIdentifier = response.actionIdentifier;
            if (actionIdentifier === SNOOZE_ACTION_ID) {
                this.handler?.("snooze");
            } else if (actionIdentifier === WAKEUP_ACTION_ID) {
                this.handler?.("wakeup");
            } else if (actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
                this.handler?.("open");
            }
        });
        return () => {
            this.subscription?.remove();
            this.subscription = undefined;
            this.handler = undefined;
        };
    }
}
//#endregion

//#region Export
export default new NativeAlarmNotifier();
//#endregion
