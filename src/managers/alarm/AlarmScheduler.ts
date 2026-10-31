//#region Types
export type AlarmPhase = "idle" | "armed" | "ringing";

export type AlarmState = {
    phase: AlarmPhase;
    /** 鳴らすべき絶対時刻（epoch ms）。armed 以外では未設定。 */
    targetEpochMs?: number;
    snoozeCount: number;
};
//#endregion

//#region Constants
export const SNOOZE_DURATION_MS = __DEV__ ? 9_000 : 9 * 60_000;

/** 締切をこれ以上過ぎていたら発報せずに破棄する（夜間に落とされた後の誤爆防止）。 */
export const STALE_ALARM_MS = 2 * 60 * 60 * 1000;
//#endregion

//#region Functions
export const createInitialAlarmState = (): AlarmState => ({ phase: "idle", snoozeCount: 0 });

export const armAlarm = (state: AlarmState, targetEpochMs: number): AlarmState => ({
    phase: "armed",
    targetEpochMs,
    snoozeCount: state.phase === "armed" ? state.snoozeCount : 0,
});

export const ringAlarm = (state: AlarmState): AlarmState =>
    state.phase === "ringing" ? state : { ...state, phase: "ringing" };

export const snoozeAlarm = (
    state: AlarmState,
    now: number,
    durationMs: number = SNOOZE_DURATION_MS,
): AlarmState => ({
    phase: "armed",
    targetEpochMs: now + durationMs,
    snoozeCount: state.snoozeCount + 1,
});

export const dismissAlarm = (): AlarmState => createInitialAlarmState();

export const isAlarmDue = (state: AlarmState, now: number): boolean =>
    state.phase === "armed" && state.targetEpochMs !== undefined && now >= state.targetEpochMs;

export const isAlarmStale = (
    state: AlarmState,
    now: number,
    staleMs: number = STALE_ALARM_MS,
): boolean => state.targetEpochMs !== undefined && now - state.targetEpochMs > staleMs;

export const alarmRemainingMs = (state: AlarmState, now: number): number =>
    state.targetEpochMs === undefined ? 0 : Math.max(0, state.targetEpochMs - now);

export const isAlarmSnoozing = (state: AlarmState): boolean =>
    state.phase === "armed" && state.snoozeCount > 0;

/** 指定した時刻の次に来る「その時刻」を epoch ms で返す。 */
export const nextAlarmEpochMs = (hour: number, minute: number, now: number): number => {
    const date = new Date(now);
    date.setHours(hour, minute, 0, 0);
    if (date.getTime() <= now) {
        date.setDate(date.getDate() + 1);
    }
    return date.getTime();
};
//#endregion
