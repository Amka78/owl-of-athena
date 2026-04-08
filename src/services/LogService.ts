type LogLevel = "debug" | "info" | "warning" | "error";

type LogEntry = {
    type: LogLevel;
    message: string;
    params?: unknown[];
    time: number;
    delta: number;
};

const MAX_LOGS = 200;

class LogService {
    private _logs: LogEntry[] = [];

    private _addLog(type: LogLevel, message: string, params?: unknown[]): void {
        const now = Date.now();
        const delta = this._logs.length ? now - this._logs[this._logs.length - 1].time : 0;
        this._logs.push({ type, message, params, time: now, delta });
        if (this._logs.length > MAX_LOGS) {
            this._logs.shift();
        }
    }

    debug(message: string, ...params: unknown[]): void {
        this._addLog("debug", message, params);
        console.debug(`[DEBUG] ${message}`, ...params);
    }

    info(message: string, ...params: unknown[]): void {
        this._addLog("info", message, params);
        console.info(`[INFO] ${message}`, ...params);
    }

    warn(message: string, ...params: unknown[]): void {
        this._addLog("warning", message, params);
        console.warn(`[WARN] ${message}`, ...params);
    }

    error(message: string, ...params: unknown[]): void {
        this._addLog("error", message, params);
        console.error(`[ERROR] ${message}`, ...params);
    }

    getLogs(level?: LogLevel): LogEntry[] {
        if (!level) return [...this._logs];
        return this._logs.filter((l) => l.type === level);
    }

    clear(): void {
        this._logs = [];
    }
}

export default new LogService();
