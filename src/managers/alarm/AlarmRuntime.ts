//#region Import Modules
import { EventEmitter } from "events";
import { AppState, Platform } from "react-native";

import {
    type AlarmState,
    alarmRemainingMs,
    armAlarm,
    createInitialAlarmState,
    dismissAlarm,
    isAlarmDue,
    isAlarmSnoozing,
    isAlarmStale,
    ringAlarm,
    SNOOZE_DURATION_MS,
    snoozeAlarm,
} from "./AlarmScheduler";

//#endregion

//#region Constants
const DEFAULT_ALARM_VOLUME = 0.8;

/** setTimeout の上限（これを超えると即発火してしまう）。 */
const MAX_TIMER_MS = 2 ** 31 - 1;
//#endregion

//#region Types
export type AlarmSnapshot = AlarmState & {
    soundFileName?: string;
    volume: number;
};

export type AlarmRuntimeClock = {
    now: () => number;
    setTimer: (handler: () => void, delayMs: number) => unknown;
    clearTimer: (handle: unknown) => void;
};

export type AlarmSoundPlayer = {
    play: (soundFileName: string | undefined, volume: number) => Promise<void>;
    stop: () => Promise<void>;
};

export type AlarmStorage = {
    load: () => Promise<AlarmSnapshot | null>;
    save: (snapshot: AlarmSnapshot) => Promise<void>;
    clear: () => Promise<void>;
};

export type AlarmRuntimeOptions = {
    clock?: AlarmRuntimeClock;
};

type AlarmTimerHandle = unknown;
//#endregion

//#region Event
export enum AlarmRuntimeEventList {
    onStateChange = "onStateChange",
    onRinging = "onRinging",
    onSnoozed = "onSnoozed",
    onDismissed = "onDismissed",
    onError = "onError",
}
//#endregion

//#region Class
export class AlarmRuntime extends EventEmitter {
    private readonly clock: AlarmRuntimeClock;
    private state: AlarmState = createInitialAlarmState();
    private soundFileName?: string;
    private volume = DEFAULT_ALARM_VOLUME;
    private timer?: AlarmTimerHandle;
    private storage?: AlarmStorage;
    private player?: AlarmSoundPlayer;
    private lifecycleSubscription?: { remove: () => void };
    private initialized = false;

    public constructor(options: AlarmRuntimeOptions = {}) {
        super();
        this.clock = options.clock ?? {
            now: () => Date.now(),
            setTimer: (handler, delayMs) => setTimeout(handler, delayMs),
            clearTimer: (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>),
        };
    }

    public setPlayer(player: AlarmSoundPlayer): void {
        this.player = player;
    }

    public setStorage(storage: AlarmStorage): void {
        this.storage = storage;
    }

    public getState(): AlarmState {
        return this.state;
    }

    public isRinging(): boolean {
        return this.state.phase === "ringing";
    }

    public isSnoozing(): boolean {
        return isAlarmSnoozing(this.state);
    }

    /**
     * 永続化された締切を読み戻し、復帰時の判定（2 時間ルール）を通す。
     * アプリ起動時に一度だけ呼ぶ。
     */
    public async initialize(): Promise<void> {
        this.subscribeLifecycle();
        if (this.initialized) return;
        this.initialized = true;

        if (this.storage !== undefined) {
            try {
                const snapshot = await this.storage.load();
                if (snapshot !== null) {
                    this.state = {
                        phase: snapshot.phase,
                        targetEpochMs: snapshot.targetEpochMs,
                        snoozeCount: snapshot.snoozeCount,
                    };
                    this.soundFileName = snapshot.soundFileName;
                    this.volume = snapshot.volume;
                    this.emitStateChange();
                }
            } catch (e) {
                this.emitError(e);
            }
        }

        await this.reconcile();
    }

    public async arm(
        targetEpochMs: number,
        options: { soundFileName?: string; volume?: number } = {},
    ): Promise<void> {
        this.soundFileName = options.soundFileName;
        if (options.volume !== undefined) {
            this.volume = options.volume;
        }
        this.state = armAlarm(this.state, targetEpochMs);
        this.emitStateChange();
        await this.persist();
        this.scheduleTimer();
    }

    /** 締切到達・デバイス発報のどちらから呼ばれてもよい（冪等）。 */
    public async ring(): Promise<void> {
        if (this.state.phase === "ringing") return;

        this.clearTimer();
        this.state = ringAlarm(this.state);
        this.emitStateChange();
        await this.persist();
        this.emit(AlarmRuntimeEventList.onRinging, this.state);

        try {
            await this.player?.play(this.soundFileName, this.volume);
        } catch (e) {
            this.emitError(e);
        }
    }

    public async snooze(durationMs: number = SNOOZE_DURATION_MS): Promise<void> {
        if (this.state.phase === "idle") return;

        this.clearTimer();
        await this.stopPlayer();
        this.state = snoozeAlarm(this.state, this.clock.now(), durationMs);
        this.emitStateChange();
        await this.persist();
        this.scheduleTimer();
        this.emit(AlarmRuntimeEventList.onSnoozed, this.state);
    }

    public async dismiss(): Promise<void> {
        if (this.state.phase === "idle") return;

        this.clearTimer();
        await this.stopPlayer();
        this.state = dismissAlarm();
        this.emitStateChange();
        await this.clearStorage();
        this.emit(AlarmRuntimeEventList.onDismissed);
    }

    /**
     * 復帰時の再評価。締切を過ぎていれば鳴らし、2 時間以上過ぎていれば破棄する。
     * 起動時・AppState 復帰時・visibilitychange 時のすべてから呼ぶ。
     */
    public async reconcile(): Promise<void> {
        if (this.state.phase === "idle") return;

        const now = this.clock.now();
        if (!isAlarmDue(this.state, now)) {
            this.scheduleTimer();
            return;
        }

        if (isAlarmStale(this.state, now)) {
            console.debug(
                `[AlarmRuntime] discarding stale alarm at ${new Date(
                    this.state.targetEpochMs ?? 0,
                ).toISOString()}`,
            );
            await this.discardStaleAlarm(now);
            return;
        }

        await this.ring();
    }

    public dispose(): void {
        this.clearTimer();
        this.lifecycleSubscription?.remove();
        this.lifecycleSubscription = undefined;
        this.removeAllListeners();
    }

    private async discardStaleAlarm(now: number): Promise<void> {
        this.clearTimer();
        await this.stopPlayer();
        this.state = dismissAlarm();
        this.emitStateChange();
        await this.clearStorage();
        console.debug(`[AlarmRuntime] alarm discarded ${now}ms after it was due.`);
    }

    private async stopPlayer(): Promise<void> {
        try {
            await this.player?.stop();
        } catch (e) {
            this.emitError(e);
        }
    }

    private scheduleTimer(): void {
        this.clearTimer();
        if (this.state.phase !== "armed") return;

        const delay = Math.min(alarmRemainingMs(this.state, this.clock.now()), MAX_TIMER_MS);
        this.timer = this.clock.setTimer(() => {
            this.timer = undefined;
            void this.reconcile();
        }, delay);
    }

    private clearTimer(): void {
        if (this.timer === undefined) return;
        this.clock.clearTimer(this.timer);
        this.timer = undefined;
    }

    private emitStateChange(): void {
        this.emit(AlarmRuntimeEventList.onStateChange, this.state);
    }

    private emitError(error: unknown): void {
        console.error("[AlarmRuntime]", error);
        this.emit(AlarmRuntimeEventList.onError, error);
    }

    private snapshot(): AlarmSnapshot {
        return {
            ...this.state,
            soundFileName: this.soundFileName,
            volume: this.volume,
        };
    }

    private async persist(): Promise<void> {
        if (this.storage === undefined) return;
        try {
            await this.storage.save(this.snapshot());
        } catch (e) {
            this.emitError(e);
        }
    }

    private async clearStorage(): Promise<void> {
        if (this.storage === undefined) return;
        try {
            await this.storage.clear();
        } catch (e) {
            this.emitError(e);
        }
    }

    private subscribeLifecycle(): void {
        if (this.lifecycleSubscription !== undefined) return;

        if (Platform.OS === "web") {
            if (typeof document === "undefined") return;
            const handler = (): void => {
                if (!document.hidden) void this.reconcile();
            };
            document.addEventListener("visibilitychange", handler);
            this.lifecycleSubscription = {
                remove: () => document.removeEventListener("visibilitychange", handler),
            };
            return;
        }

        const subscription = AppState.addEventListener("change", (status) => {
            if (status === "active") void this.reconcile();
        });
        this.lifecycleSubscription = subscription;
    }
}
//#endregion

//#region Export
export default new AlarmRuntime();
//#endregion
