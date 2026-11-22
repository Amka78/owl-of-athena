//#region Import Modules
import { AuroraInstance } from "../sdk";
import { ConnectionStatesToNames } from "../sdk/AuroraConstants";
import { AuroraEventList } from "../sdk/AuroraEventList";
import type { CommandResult } from "../sdk/AuroraTypes";

//#endregion

//#region Types
export type AuroraCommLogEntryKind = "send" | "recv" | "conn";

export type AuroraCommLogEntry = {
    id: number;
    at: number;
    kind: AuroraCommLogEntryKind;
    /** 主テキスト（例: "os-info 1"）。 */
    text: string;
    /** 補足（例: "OK 12ms" / "error 3" / "CONNECTING"）。 */
    detail?: string;
    failed?: boolean;
};

export type AuroraCommLogListener = (entries: readonly AuroraCommLogEntry[]) => void;
//#endregion

//#region Constants
/** 保持する履歴の上限。超えた分は古い順に捨てる。 */
const MAX_ENTRIES = 100;
//#endregion

//#region Module State
let nextId = 1;
let entries: AuroraCommLogEntry[] = [];
const listeners = new Set<AuroraCommLogListener>();
//#endregion

//#region Functions
const pushEntry = (entry: Omit<AuroraCommLogEntry, "id" | "at">): void => {
    entries = [...entries, { ...entry, id: nextId++, at: Date.now() }];
    if (entries.length > MAX_ENTRIES) {
        entries = entries.slice(entries.length - MAX_ENTRIES);
    }
    const snapshot = entries;
    for (const listener of listeners) {
        listener(snapshot);
    }
};

const commandText = (cmd: CommandResult<unknown>): string =>
    [cmd.command, ...(cmd.args ?? [])]
        .filter((part) => part !== undefined && part !== "")
        .join(" ");

const responseDetail = (cmd: CommandResult<unknown>): { detail: string; failed: boolean } => {
    if (cmd.error) {
        const code =
            cmd.response !== null && typeof cmd.response === "object" && "error" in cmd.response
                ? (cmd.response as { error?: number }).error
                : undefined;
        return {
            detail: code !== undefined ? `error ${code}` : "FAILED",
            failed: true,
        };
    }
    const elapsed =
        cmd.beginTime !== undefined && cmd.endTime !== undefined
            ? cmd.endTime - cmd.beginTime
            : undefined;
    return {
        detail: elapsed !== undefined ? `OK ${elapsed}ms` : "OK",
        failed: false,
    };
};

const onCmdBegin = (cmd: CommandResult<unknown>): void => {
    pushEntry({ kind: "send", text: commandText(cmd) });
};

const onCmdEnd = (cmd: CommandResult<unknown>): void => {
    const { detail, failed } = responseDetail(cmd);
    pushEntry({ kind: "recv", text: commandText(cmd), detail, failed });
};

const onConnectionChange = (connectionState: number): void => {
    const stateName =
        ConnectionStatesToNames[connectionState as keyof typeof ConnectionStatesToNames];
    pushEntry({
        kind: "conn",
        text: "bluetooth",
        detail: stateName ?? String(connectionState),
    });
};
//#endregion

//#region Exports
/**
 * Aurora SDK のコマンド送受信・接続状態イベントを購読して
 * 直近の通信履歴を保持する。モジュール読み込み時に自動で install される。
 */
export const install = (): void => {
    AuroraInstance.on(AuroraEventList.cmdBegin, onCmdBegin);
    AuroraInstance.on(AuroraEventList.cmdEnd, onCmdEnd);
    AuroraInstance.on(AuroraEventList.bluetoothConnectionChange, onConnectionChange);
};

export const clear = (): void => {
    entries = [];
    const snapshot = entries;
    for (const listener of listeners) {
        listener(snapshot);
    }
};

export const getEntries = (): readonly AuroraCommLogEntry[] => entries;

/** 履歴の追加を購読する。戻り値は購読解除関数。 */
export const subscribe = (listener: AuroraCommLogListener): (() => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};
//#endregion

install();
