//#region Types
export type AlarmKeepAliveReason = "sleeping" | "disconnected-fallback";

/**
 * 夜間のあいだアプリ（JS タイマー）を生かしておくための要求。
 * 実装はプラットフォームごとに異なるが、呼び出し側はこのインターフェースだけを使う。
 */
export type AlarmKeepAlive = {
    acquire: (reason: AlarmKeepAliveReason) => Promise<void>;
    release: () => Promise<void>;
};
//#endregion
