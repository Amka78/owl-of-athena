//#region Import Modules

import type { AlarmNotificationAction, AlarmNotifier } from "../AlarmNotifierTypes";
import {
    AlarmRuntime,
    AlarmRuntimeEventList,
    type AlarmSnapshot,
    type AlarmStorage,
} from "../AlarmRuntime";
import { STALE_ALARM_MS } from "../AlarmScheduler";

//#endregion

//#region Function
const createClock = () => {
    let now = 1_000_000;
    let handler: (() => void) | undefined;
    let lastDelay = 0;

    return {
        clock: {
            now: () => now,
            setTimer: (timerHandler: () => void, delayMs: number) => {
                handler = timerHandler;
                lastDelay = delayMs;
                return 1;
            },
            clearTimer: () => {
                handler = undefined;
            },
        },
        advance: (ms: number): void => {
            now += ms;
        },
        fire: (): void => {
            const pending = handler;
            handler = undefined;
            pending?.();
        },
        lastDelay: (): number => lastDelay,
        hasTimer: (): boolean => handler !== undefined,
    };
};

const flush = async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 0));
};

const createPlayer = () => ({
    play: jest.fn(() => Promise.resolve()),
    stop: jest.fn(() => Promise.resolve()),
});

const createStorage = (initial: AlarmSnapshot | null = null) => {
    let saved = initial;
    const storage: AlarmStorage = {
        load: jest.fn(async () => saved),
        save: jest.fn(async (snapshot: AlarmSnapshot) => {
            saved = snapshot;
        }),
        clear: jest.fn(async () => {
            saved = null;
        }),
    };
    return { storage, getSaved: () => saved };
};

const createNotifier = () => {
    let handler: ((action: AlarmNotificationAction) => void) | undefined;
    const notifier: AlarmNotifier = {
        prepare: jest.fn(async () => undefined),
        notify: jest.fn(async () => undefined),
        cancel: jest.fn(async () => undefined),
        subscribe: jest.fn((next: (action: AlarmNotificationAction) => void) => {
            handler = next;
            return () => {
                handler = undefined;
            };
        }),
    };
    return { notifier, fire: (action: AlarmNotificationAction) => handler?.(action) };
};
//#endregion

//#region Tests
describe("AlarmRuntime UnitTest", () => {
    it("arms and schedules a timer for the remaining time", async () => {
        const clock = createClock();
        const runtime = new AlarmRuntime({ clock: clock.clock });

        await runtime.arm(1_000_000 + 60_000, { soundFileName: "classic", volume: 0.5 });

        expect(runtime.getState().phase).toBe("armed");
        expect(clock.lastDelay()).toBe(60_000);
        expect(clock.hasTimer()).toBe(true);
    });

    it("rings when the deadline is reached", async () => {
        const clock = createClock();
        const runtime = new AlarmRuntime({ clock: clock.clock });
        const player = createPlayer();
        const onRinging = jest.fn();
        runtime.setPlayer(player);
        runtime.on(AlarmRuntimeEventList.onRinging, onRinging);

        await runtime.arm(1_000_000 + 60_000, { soundFileName: "classic", volume: 0.5 });
        clock.advance(60_000);
        clock.fire();
        await flush();

        expect(runtime.getState().phase).toBe("ringing");
        expect(player.play).toHaveBeenCalledWith("classic", 0.5);
        expect(onRinging).toHaveBeenCalledTimes(1);
    });

    it("plays only once even if ring is called twice", async () => {
        const clock = createClock();
        const runtime = new AlarmRuntime({ clock: clock.clock });
        const player = createPlayer();
        runtime.setPlayer(player);

        await runtime.arm(1_000_000 + 1000, { soundFileName: "classic", volume: 0.5 });
        clock.advance(1000);
        await runtime.reconcile();
        await runtime.ring();

        expect(player.play).toHaveBeenCalledTimes(1);
    });

    it("stops the sound and re-arms when snoozed", async () => {
        const clock = createClock();
        const runtime = new AlarmRuntime({ clock: clock.clock });
        const player = createPlayer();
        const onSnoozed = jest.fn();
        runtime.setPlayer(player);
        runtime.on(AlarmRuntimeEventList.onSnoozed, onSnoozed);

        await runtime.arm(1_000_000 + 1000, { soundFileName: "classic", volume: 0.5 });
        clock.advance(1000);
        await runtime.reconcile();
        await runtime.snooze(9 * 60_000);

        expect(player.stop).toHaveBeenCalledTimes(1);
        expect(runtime.getState()).toEqual({
            phase: "armed",
            targetEpochMs: 1_001_000 + 9 * 60_000,
            snoozeCount: 1,
        });
        expect(runtime.isSnoozing()).toBe(true);
        expect(onSnoozed).toHaveBeenCalledTimes(1);
        expect(clock.hasTimer()).toBe(true);
    });

    it("ignores snooze while idle", async () => {
        const clock = createClock();
        const runtime = new AlarmRuntime({ clock: clock.clock });

        await runtime.snooze();

        expect(runtime.getState().phase).toBe("idle");
        expect(clock.hasTimer()).toBe(false);
    });

    it("stops the sound and clears the state when dismissed", async () => {
        const clock = createClock();
        const runtime = new AlarmRuntime({ clock: clock.clock });
        const player = createPlayer();
        const { storage, getSaved } = createStorage();
        const onDismissed = jest.fn();
        runtime.setPlayer(player);
        runtime.setStorage(storage);
        runtime.on(AlarmRuntimeEventList.onDismissed, onDismissed);

        await runtime.arm(1_000_000 + 1000, { soundFileName: "classic", volume: 0.5 });
        clock.advance(1000);
        await runtime.reconcile();
        await runtime.dismiss();

        expect(player.stop).toHaveBeenCalledTimes(1);
        expect(runtime.getState().phase).toBe("idle");
        expect(clock.hasTimer()).toBe(false);
        expect(getSaved()).toBeNull();
        expect(onDismissed).toHaveBeenCalledTimes(1);
    });

    it("does nothing when dismissed while idle", async () => {
        const clock = createClock();
        const runtime = new AlarmRuntime({ clock: clock.clock });
        const onDismissed = jest.fn();
        runtime.on(AlarmRuntimeEventList.onDismissed, onDismissed);

        await runtime.dismiss();

        expect(onDismissed).not.toHaveBeenCalled();
    });

    it("reschedules without ringing when the deadline is still in the future", async () => {
        const clock = createClock();
        const runtime = new AlarmRuntime({ clock: clock.clock });
        const player = createPlayer();
        runtime.setPlayer(player);

        await runtime.arm(1_000_000 + 60_000, { soundFileName: "classic", volume: 0.5 });
        clock.advance(10_000);
        await runtime.reconcile();

        expect(runtime.getState().phase).toBe("armed");
        expect(clock.lastDelay()).toBe(50_000);
        expect(player.play).not.toHaveBeenCalled();
    });

    it("rings when the deadline was missed within the stale window", async () => {
        const clock = createClock();
        const runtime = new AlarmRuntime({ clock: clock.clock });
        const player = createPlayer();
        runtime.setPlayer(player);

        await runtime.arm(1_000_000 + 1000, { soundFileName: "classic", volume: 0.5 });
        clock.advance(1000 + 60 * 60_000);
        await runtime.reconcile();

        expect(runtime.getState().phase).toBe("ringing");
        expect(player.play).toHaveBeenCalledTimes(1);
    });

    it("discards an alarm that is older than the stale window", async () => {
        const clock = createClock();
        const runtime = new AlarmRuntime({ clock: clock.clock });
        const player = createPlayer();
        const { storage, getSaved } = createStorage();
        runtime.setPlayer(player);
        runtime.setStorage(storage);

        await runtime.arm(1_000_000 + 1000, { soundFileName: "classic", volume: 0.5 });
        clock.advance(1000 + STALE_ALARM_MS + 1);
        await runtime.reconcile();

        expect(runtime.getState().phase).toBe("idle");
        expect(player.play).not.toHaveBeenCalled();
        expect(getSaved()).toBeNull();
    });

    it("persists the sound and volume with the deadline", async () => {
        const clock = createClock();
        const runtime = new AlarmRuntime({ clock: clock.clock });
        const { storage, getSaved } = createStorage();
        runtime.setStorage(storage);

        await runtime.arm(1_000_000 + 1000, { soundFileName: "classic", volume: 0.4 });

        expect(getSaved()).toEqual({
            phase: "armed",
            targetEpochMs: 1_000_000 + 1000,
            snoozeCount: 0,
            soundFileName: "classic",
            volume: 0.4,
        });
    });

    it("restores a saved alarm and rings when it is overdue", async () => {
        const clock = createClock();
        const { storage } = createStorage({
            phase: "armed",
            targetEpochMs: 1_000_000 - 1000,
            snoozeCount: 0,
            soundFileName: "epic",
            volume: 0.7,
        });
        const runtime = new AlarmRuntime({ clock: clock.clock });
        const player = createPlayer();
        runtime.setPlayer(player);
        runtime.setStorage(storage);

        await runtime.initialize();

        expect(runtime.getState().phase).toBe("ringing");
        expect(player.play).toHaveBeenCalledWith("epic", 0.7);
    });

    it("restores a saved alarm and keeps it armed when it is still in the future", async () => {
        const clock = createClock();
        const { storage } = createStorage({
            phase: "armed",
            targetEpochMs: 1_000_000 + 30_000,
            snoozeCount: 2,
            soundFileName: "epic",
            volume: 0.7,
        });
        const runtime = new AlarmRuntime({ clock: clock.clock });
        const player = createPlayer();
        runtime.setPlayer(player);
        runtime.setStorage(storage);

        await runtime.initialize();

        expect(runtime.getState().phase).toBe("armed");
        expect(runtime.getState().snoozeCount).toBe(2);
        expect(runtime.isSnoozing()).toBe(true);
        expect(clock.lastDelay()).toBe(30_000);
        expect(player.play).not.toHaveBeenCalled();
    });

    it("requests notification permission when armed", async () => {
        const clock = createClock();
        const { notifier } = createNotifier();
        const runtime = new AlarmRuntime({ clock: clock.clock, notifier });

        await runtime.arm(1_000_000 + 60_000);

        expect(notifier.prepare).toHaveBeenCalledTimes(1);
    });

    it("shows a notification when it starts ringing", async () => {
        const clock = createClock();
        const { notifier } = createNotifier();
        const runtime = new AlarmRuntime({ clock: clock.clock, notifier });

        await runtime.arm(1_000_000 + 1000);
        await runtime.ring();

        expect(notifier.notify).toHaveBeenCalledTimes(1);
    });

    it("dismisses the notification when snoozed", async () => {
        const clock = createClock();
        const { notifier } = createNotifier();
        const runtime = new AlarmRuntime({ clock: clock.clock, notifier });

        await runtime.arm(1_000_000 + 1000);
        await runtime.ring();
        await runtime.snooze(60_000);

        expect(notifier.cancel).toHaveBeenCalledTimes(1);
    });

    it("dismisses the notification when the alarm is dismissed", async () => {
        const clock = createClock();
        const { notifier } = createNotifier();
        const runtime = new AlarmRuntime({ clock: clock.clock, notifier });

        await runtime.arm(1_000_000 + 1000);
        await runtime.ring();
        await runtime.dismiss();

        expect(notifier.cancel).toHaveBeenCalledTimes(1);
    });

    it("snoozes when the notification snooze action is used", async () => {
        const clock = createClock();
        const { notifier, fire } = createNotifier();
        const runtime = new AlarmRuntime({ clock: clock.clock, notifier });

        await runtime.initialize();
        await runtime.arm(1_000_000 + 1000);
        await runtime.ring();
        fire("snooze");
        await flush();

        expect(runtime.isSnoozing()).toBe(true);
        expect(runtime.getState().phase).toBe("armed");
    });

    it("dismisses when the notification wake up action is used", async () => {
        const clock = createClock();
        const { notifier, fire } = createNotifier();
        const onDismissed = jest.fn();
        const runtime = new AlarmRuntime({ clock: clock.clock, notifier });
        runtime.on(AlarmRuntimeEventList.onDismissed, onDismissed);

        await runtime.initialize();
        await runtime.arm(1_000_000 + 1000);
        await runtime.ring();
        fire("wakeup");
        await flush();

        expect(runtime.getState().phase).toBe("idle");
        expect(onDismissed).toHaveBeenCalledTimes(1);
    });
});
//#endregion
