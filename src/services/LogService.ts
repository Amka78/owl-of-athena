type LogLevel = "debug" | "info" | "warning" | "error";

export type LogEntry = {
    type: LogLevel;
    message: string;
    params?: unknown[];
    time: number;
    delta: number;
};

type ConsoleMethod = "debug" | "info" | "log" | "warn" | "error";

const MAX_LOGS = 500;

const stringify = (value: unknown): string => {
    if (typeof value === "string") return value;
    if (value instanceof Error) return value.stack ?? `${value.name}: ${value.message}`;

    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
};

export const formatLogEntries = (logs: LogEntry[]): string => {
    return logs
        .map((log) => {
            const params = log.params?.length
                ? ` ${log.params.map((param) => stringify(param)).join(" ")}`
                : "";
            return `${new Date(log.time).toISOString()} [${log.type.toUpperCase()}] ${log.message}${params}`;
        })
        .join("\n");
};

class LogService {
    private _logs: LogEntry[] = [];

    private _installed = false;

    private _record(type: LogLevel, message: string, params?: unknown[]): void {
        const now = Date.now();
        const delta = this._logs.length ? now - this._logs[this._logs.length - 1].time : 0;
        this._logs.push({ type, message, params, time: now, delta });
        if (this._logs.length > MAX_LOGS) {
            this._logs.shift();
        }
    }

    /**
     * console.* を LogService に取り込む。二重登録を避けるため 1 回だけ有効になる。
     * 戻り値は元の console に戻す関数（テスト用）。
     */
    install(): () => void {
        if (this._installed) return () => {};
        this._installed = true;

        const globalConsole = console as unknown as Record<
            ConsoleMethod,
            (...args: unknown[]) => void
        >;
        const originals: Partial<Record<ConsoleMethod, (...args: unknown[]) => void>> = {};

        const patch = (method: ConsoleMethod, level: LogLevel): void => {
            const original = globalConsole[method].bind(console);
            originals[method] = original;
            globalConsole[method] = (...args: unknown[]) => {
                this._record(level, stringify(args[0]), args.slice(1));
                original(...args);
            };
        };

        patch("debug", "debug");
        patch("info", "info");
        patch("log", "info");
        patch("warn", "warning");
        patch("error", "error");

        return () => {
            (Object.keys(originals) as ConsoleMethod[]).forEach((method) => {
                globalConsole[method] = originals[method]!;
            });
            this._installed = false;
        };
    }

    getLogs(level?: LogLevel): LogEntry[] {
        if (!level) return [...this._logs];
        return this._logs.filter((l) => l.type === level);
    }

    toText(): string {
        return formatLogEntries(this._logs);
    }

    clear(): void {
        this._logs = [];
    }
}

export default new LogService();
