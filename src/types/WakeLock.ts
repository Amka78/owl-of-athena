export type WakeLockSentinel = {
    addEventListener(
        event: string,
        listener: (...args: any[]) => void,
        opts?: { once: boolean }
    ): any;
    release(): void;
};
type WakeLock = {
    request: (target: string) => Promise<WakeLockSentinel>;
};
export type ExperimentalNavigator = Navigator & {
    wakeLock: WakeLock;
};
export declare const navigator: ExperimentalNavigator;
