//#region Import Modules
import {
    alarmRemainingMs,
    armAlarm,
    createInitialAlarmState,
    dismissAlarm,
    isAlarmDue,
    isAlarmSnoozing,
    isAlarmStale,
    nextAlarmEpochMs,
    ringAlarm,
    SNOOZE_DURATION_MS,
    STALE_ALARM_MS,
    snoozeAlarm,
} from "../AlarmScheduler";

//#endregion

//#region Tests
describe("AlarmScheduler UnitTest", () => {
    it("creates an idle state", () => {
        const state = createInitialAlarmState();

        expect(state.phase).toBe("idle");
        expect(state.targetEpochMs).toBeUndefined();
        expect(state.snoozeCount).toBe(0);
    });

    it("arms to the given deadline", () => {
        const state = armAlarm(createInitialAlarmState(), 5000);

        expect(state.phase).toBe("armed");
        expect(state.targetEpochMs).toBe(5000);
        expect(state.snoozeCount).toBe(0);
    });

    it("keeps the snooze count when re-arming a snoozed alarm", () => {
        const snoozed = snoozeAlarm(createInitialAlarmState(), 1000, 9000);

        const rearmed = armAlarm(snoozed, 20000);

        expect(rearmed.snoozeCount).toBe(1);
        expect(rearmed.targetEpochMs).toBe(20000);
    });

    it("only rings once", () => {
        const armed = armAlarm(createInitialAlarmState(), 5000);
        const ringing = ringAlarm(armed);

        expect(ringing.phase).toBe("ringing");
        expect(ringAlarm(ringing)).toBe(ringing);
    });

    it("snoozes by the given duration", () => {
        const ringing = ringAlarm(armAlarm(createInitialAlarmState(), 1000));

        const snoozed = snoozeAlarm(ringing, 1000, SNOOZE_DURATION_MS);

        expect(snoozed.phase).toBe("armed");
        expect(snoozed.targetEpochMs).toBe(1000 + SNOOZE_DURATION_MS);
        expect(snoozed.snoozeCount).toBe(1);
        expect(isAlarmSnoozing(snoozed)).toBe(true);
    });

    it("is not snoozing before the first snooze", () => {
        const armed = armAlarm(createInitialAlarmState(), 5000);

        expect(isAlarmSnoozing(armed)).toBe(false);
    });

    it("dismisses back to idle", () => {
        const state = dismissAlarm();

        expect(state).toEqual({ phase: "idle", snoozeCount: 0 });
    });

    it("is due only when armed and past the deadline", () => {
        const armed = armAlarm(createInitialAlarmState(), 5000);

        expect(isAlarmDue(armed, 4999)).toBe(false);
        expect(isAlarmDue(armed, 5000)).toBe(true);
        expect(isAlarmDue(ringAlarm(armed), 6000)).toBe(false);
        expect(isAlarmDue(createInitialAlarmState(), 6000)).toBe(false);
    });

    it("treats deadlines older than the stale window as stale", () => {
        const armed = armAlarm(createInitialAlarmState(), 5000);

        expect(isAlarmStale(armed, 5000 + STALE_ALARM_MS)).toBe(false);
        expect(isAlarmStale(armed, 5001 + STALE_ALARM_MS)).toBe(true);
        expect(isAlarmStale(createInitialAlarmState(), 5000 + STALE_ALARM_MS)).toBe(false);
    });

    it("computes the remaining time without going negative", () => {
        const armed = armAlarm(createInitialAlarmState(), 5000);

        expect(alarmRemainingMs(armed, 1000)).toBe(4000);
        expect(alarmRemainingMs(armed, 6000)).toBe(0);
        expect(alarmRemainingMs(createInitialAlarmState(), 6000)).toBe(0);
    });

    it("picks the next occurrence of the alarm time today", () => {
        const now = new Date(2026, 10, 1, 3, 0, 0).getTime();

        const target = nextAlarmEpochMs(7, 0, now);

        expect(new Date(target).getDate()).toBe(1);
        expect(new Date(target).getHours()).toBe(7);
        expect(new Date(target).getMinutes()).toBe(0);
    });

    it("picks tomorrow when the alarm time already passed", () => {
        const now = new Date(2026, 10, 1, 23, 0, 0).getTime();

        const target = nextAlarmEpochMs(7, 0, now);

        expect(new Date(target).getDate()).toBe(2);
        expect(new Date(target).getHours()).toBe(7);
    });

    it("picks tomorrow when the alarm time is exactly now", () => {
        const now = new Date(2026, 10, 1, 7, 0, 0).getTime();

        const target = nextAlarmEpochMs(7, 0, now);

        expect(new Date(target).getDate()).toBe(2);
    });
});
//#endregion
