//#region Import Modules
import { Message, MessageKeys } from "../../constants";
import type { AlarmNotificationAction, AlarmNotifier } from "./AlarmNotifierTypes";

//#endregion

//#region Types
type BrowserNotificationInstance = {
    close: () => void;
    onclick: ((event: unknown) => void) | null;
};

type BrowserNotificationConstructor = {
    new (title: string, options?: { body?: string; tag?: string }): BrowserNotificationInstance;
    permission: "default" | "denied" | "granted";
    requestPermission: () => Promise<"default" | "denied" | "granted">;
};
//#endregion

//#region Function
const getBrowserNotification = (): BrowserNotificationConstructor | undefined =>
    (globalThis as { Notification?: BrowserNotificationConstructor }).Notification;
//#endregion

//#region Class
/**
 * Web 用。ブラウザの Notification API は通知アクションをサポートしないため、
 * 通知のクリックだけを扱う（スヌーズ・起床はアプリ画面から行う）。
 */
class WebAlarmNotifier implements AlarmNotifier {
    private notification?: BrowserNotificationInstance;
    private handler?: (action: AlarmNotificationAction) => void;

    public async prepare(): Promise<void> {
        const BrowserNotification = getBrowserNotification();
        if (BrowserNotification === undefined) return;
        if (BrowserNotification.permission === "default") {
            await BrowserNotification.requestPermission();
        }
    }

    public async notify(): Promise<void> {
        const BrowserNotification = getBrowserNotification();
        if (BrowserNotification === undefined) return;
        if (BrowserNotification.permission !== "granted") return;

        this.notification?.close();
        const notification = new BrowserNotification(
            Message.get(MessageKeys.alarm_notification_title),
            {
                body: Message.get(MessageKeys.alarm_notification_body),
                tag: "aurora-alarm",
            },
        );
        notification.onclick = (): void => {
            this.handler?.("open");
            notification.close();
        };
        this.notification = notification;
    }

    public async cancel(): Promise<void> {
        this.notification?.close();
        this.notification = undefined;
    }

    public subscribe(handler: (action: AlarmNotificationAction) => void): () => void {
        this.handler = handler;
        return () => {
            this.handler = undefined;
        };
    }
}
//#endregion

//#region Export
export default new WebAlarmNotifier();
//#endregion
