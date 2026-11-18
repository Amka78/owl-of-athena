//#region Imports

import crc32 from "buffer-crc32";
import { EventEmitter } from "events";

import { EventIds } from "../AuroraConstants";
import { versionToString } from "../util";
import { HeatshrinkEncoder } from "./heatshrink";

//#endregion

//#region Types
export type DeviceResponse =
    | { kind: "plain" }
    | { kind: "error"; error: number; message: string }
    | { kind: "object"; lines: string[]; error?: boolean }
    | {
          kind: "table";
          columns: string[];
          rows: Array<Array<string | number | boolean>>;
      }
    | { kind: "output"; chunks: Buffer[]; infoLines: string[] }
    | { kind: "input" };
//#endregion

//#region Constants
export const VIRTUAL_DEFAULT_OS_VERSION = 99900;
export const VIRTUAL_DEFAULT_BATTERY_LEVEL = 100;

const DEVICE_EVENT = "deviceEvent";
const WRITE_FINISHED = "writeFinished";
const INPUT_IDLE_COMPLETE_MS = 500;
const OUTPUT_CHUNK_MAX = 120;
const BATTERY_EVENT_DELAY_MS = 150;
/** 実機と同じく、バッテリー残量を定期通知する間隔。 */
const BATTERY_EVENT_INTERVAL_MS = 5000;
/** 就寝シナリオを短縮するときの、アラーム発火までの既定秒数。 */
const DEFAULT_SLEEP_SCENARIO_SECONDS = 20;
/** アラーム発火から「起床ボタン押下（BUTTON_MONITOR）」までの秒数。 */
const BUTTON_PRESS_DELAY_MS = 8000;
/** 就寝中にアラームが鳴る時点としてプロフィールから参照するキー。 */
const PROFILE_WAKEUP_TIME_KEY = "{wakeup-time:";
//#endregion

/**
 * 仮想 Aurora 端末（アプリ内エミュレーション）。
 *
 * 実機の BLE ピリオドを模した「コマンド応答」と「イベント通知」を返すだけの
 * 状態機械 + メモリ内ファイルシステム。ワイヤプロトコルの枠組み
 * （OBJECT / TABLE / OUTPUT / INPUT_REQUESTED / IDLE）は VirtualAuroraBluetooth が
 * AuroraBluetoothParser へ流し込むため、ここは端末の実体（SD カード上のファイルと
 * ファームウェアの挙動）だけを担う。
 *
 * 端末の残り状態（バッテリー量・ファームウェアバージョン）は env で上書きできる:
 *  - EXPO_PUBLIC_VIRTUAL_AURORA_VERSION: os-info の Version（既定 99900 = 更新提示が出ない高値）
 *  - EXPO_PUBLIC_VIRTUAL_AURORA_BATTERY: BATTERY_MONITOR / os-info の残量 %（既定 100）
 *
 * 就寝シナリオ（Phase 3）:
 *  - GO TO BED（prof-load default.prof）を検知するとアラーム発火を予約する。
 *  - 既定は端末の実時間挙動（プロフィールの wakeup-time に発火）だが、開発用に
 *    EXPO_PUBLIC_VIRTUAL_AURORA_FAST=1（または EXPO_PUBLIC_VIRTUAL_AURORA_SLEEP_SECONDS=<秒>）で
 *    就寝直後の固定秒数に短縮できる。
 */
export class VirtualAuroraDevice extends EventEmitter {
    private batteryLevel: number;
    private osVersion: number;
    private bootloaderVersion: number;
    private bleVersion: number;
    private loadedProfile?: string;
    private enabledEventMask: number;
    private files: Map<string, Buffer>;
    private pendingWrite?: { key: string; chunks: Buffer[]; rename: boolean };
    private inputIdleTimer?: ReturnType<typeof setTimeout>;
    private batteryEventTimer?: ReturnType<typeof setTimeout>;
    private batteryInterval?: ReturnType<typeof setInterval>;
    private alarmTimer?: ReturnType<typeof setTimeout>;
    private buttonTimer?: ReturnType<typeof setTimeout>;
    private wakeupTimeOfDayMs?: number;
    private sleepScenarioSeconds?: number;
    private buttonPressDelayMs: number;
    private batteryEventIntervalMs: number;
    private sleepStartMs?: number;

    constructor(options?: {
        osVersion?: number;
        batteryLevel?: number;
        sleepScenarioSeconds?: number;
        buttonPressDelayMs?: number;
        batteryEventIntervalMs?: number;
    }) {
        super();

        const envVersion = Number(process.env.EXPO_PUBLIC_VIRTUAL_AURORA_VERSION);
        this.osVersion =
            options?.osVersion ??
            (Number.isFinite(envVersion) && envVersion > 0
                ? envVersion
                : VIRTUAL_DEFAULT_OS_VERSION);
        const envBattery = Number(process.env.EXPO_PUBLIC_VIRTUAL_AURORA_BATTERY);
        this.batteryLevel =
            options?.batteryLevel ??
            (Number.isFinite(envBattery) && envBattery > 0 && envBattery <= 100
                ? envBattery
                : VIRTUAL_DEFAULT_BATTERY_LEVEL);
        // 更新提示（app→bootloader→BLE の優先順）が出ないよう、bootloader/BLE は高値にしておく。
        // フラッシュフローの検証は EXPO_PUBLIC_VIRTUAL_AURORA_VERSION で古い Version を指定する。
        this.bootloaderVersion = 99900;
        this.bleVersion = 99900;
        this.enabledEventMask = 0;
        this.buttonPressDelayMs = options?.buttonPressDelayMs ?? BUTTON_PRESS_DELAY_MS;
        this.batteryEventIntervalMs = options?.batteryEventIntervalMs ?? BATTERY_EVENT_INTERVAL_MS;

        const envSleepSeconds = Number(process.env.EXPO_PUBLIC_VIRTUAL_AURORA_SLEEP_SECONDS);
        this.sleepScenarioSeconds =
            options?.sleepScenarioSeconds ??
            (process.env.EXPO_PUBLIC_VIRTUAL_AURORA_FAST === "1"
                ? Number.isFinite(envSleepSeconds) && envSleepSeconds > 0
                    ? envSleepSeconds
                    : DEFAULT_SLEEP_SCENARIO_SECONDS
                : undefined);

        this.files = new Map();
        this.initFileSystem();
    }

    /** 端末への電源投入を模す。接続のたびにイベント購読・書き込み途中状態をリセットする。 */
    public connect(): void {
        this.clearTimers();
        this.enabledEventMask = 0;
        this.pendingWrite = undefined;
        this.loadedProfile = undefined;
        this.wakeupTimeOfDayMs = undefined;
        this.sleepStartMs = undefined;
    }

    public disconnect(): void {
        this.clearTimers();
        this.enabledEventMask = 0;
        this.pendingWrite = undefined;
    }

    /** アプリから届いたコマンドを処理し、応答を返す。 */
    public execute(commandLine: string): DeviceResponse {
        const [command, ...args] = commandLine.trim().split(/\s+/);

        switch (command) {
            case "os-info":
                return this.cmdOsInfo();

            case "clock-set":
                return { kind: "plain" };

            case "prof-load":
                this.loadedProfile = args[0] ?? "default.prof";
                this.sleepStartMs = Date.now();
                this.scheduleSleepScenario();
                return { kind: "plain" };

            case "prof-unload":
                this.loadedProfile = undefined;
                this.sleepStartMs = undefined;
                this.cancelSleepScenario();
                return { kind: "plain" };

            case "event-output-enable":
                return this.cmdEventOutputEnable(args[0]);

            case "event-output-disable":
                this.enabledEventMask = 0;
                this.clearBatteryTimer();
                return { kind: "plain" };

            case "log-level-display":
            case "log-output-display":
                return { kind: "plain" };

            case "sd-dir-read":
                return this.cmdSdDirRead(args);

            case "sd-file-read":
                return this.cmdSdFileRead(args);

            case "sd-file-info":
                return this.cmdSdFileInfo(args);

            case "sd-file-write":
                return this.cmdSdFileWrite(args);

            case "sd-file-del":
                this.files.delete(this.normalize(args[0]));
                return { kind: "plain" };

            case "sd-rename":
                return this.cmdSdRename(args);

            case "sd-dir-del":
                this.deleteTree(args[0]);
                return { kind: "plain" };

            case "sd-dir-create":
                // ディレクトリはキーの接頭辞から暗黙に存在するため、作成は何もしない
                return { kind: "plain" };

            case "os-shutdown":
                return { kind: "plain" };

            default:
                return { kind: "error", error: -1, message: `Unknown command: ${command}` };
        }
    }

    /** sd-file-write の入力ストリーム（CMD_DATA 経由の連続書き込み）を受け取る。 */
    public writeInput(data: Buffer): void {
        if (!this.pendingWrite) return;

        this.pendingWrite.chunks.push(Buffer.from(data));

        clearTimeout(this.inputIdleTimer);
        this.inputIdleTimer = setTimeout(() => {
            this.finishWrite();
        }, INPUT_IDLE_COMPLETE_MS);
    }

    /** 端末内ファイルを直接参照する（テスト・フィクスチャ用）。 */
    public getFile(path: string): Buffer | undefined {
        return this.files.get(this.normalize(path));
    }

    /** 端末内ファイルを直接書き込む（テスト・フィクスチャ用）。 */
    public setFile(path: string, content: Buffer | string): void {
        this.files.set(
            this.normalize(path),
            Buffer.isBuffer(content) ? content : Buffer.from(content),
        );
    }

    private initFileSystem(): void {
        // プロフィール一覧は空で初期化（一覧読み取り自体は成功させる）。
        // プロフィール実体はアプリのサーバ側キャッシュを使うため、初期状態では入れない。
        this.files.set("profiles/_profiles.list", Buffer.from(""));

        // 未転送セッションの転送ダイアログや Sessions 画面の一覧を最初から確認できるよう、
        // 前日・前々日のサンプルセッションを 2 件同梱する。
        this.addSampleSession(1, 22, 0, 8 * 60 * 60 * 1000, "3a1f9c.dat", 64);
        this.addSampleSession(2, 21, 30, 7 * 60 * 60 * 1000, "7c2e4b.dat", 96);
    }

    /** 検証用サンプルセッション（session.txt + stream ファイル 1 本）を生成して仮想 SD へ置く。 */
    private addSampleSession(
        daysAgo: number,
        hour: number,
        minute: number,
        durationMs: number,
        streamFile: string,
        streamBytes: number,
    ): void {
        const startedAt = new Date();
        startedAt.setDate(startedAt.getDate() - daysAgo);
        startedAt.setHours(hour, minute, 0, 0);

        const dirName = `${formatSampleDate(startedAt)}@${String(startedAt.getHours()).padStart(2, "0")}${String(startedAt.getMinutes()).padStart(2, "0")}`;
        const startEpoch = startedAt.getTime();

        const sessionTxt = [
            "version: 30000",
            `date: ${startEpoch}`,
            "profile: default.prof",
            `duration: ${durationMs}`,
            "events.0.id: 1",
            "events.0.time: 300000",
            "events.0.flags: 2",
            "events.1.id: 1",
            `events.1.time: ${Math.round(durationMs / 2)}`,
            "events.1.flags: 3",
            "events.2.id: 1",
            `events.2.time: ${durationMs - 1500000}`,
            "events.2.flags: 1",
            "events.3.id: 27",
            "events.3.time: 3000",
            "events.3.flags: 1",
            "streams.0.id: 0",
            "streams.0.time: 0",
            "streams.0.type: BOOL",
            `streams.0.file: ${streamFile}`,
            "streams.0.asleepAt: 1000",
            "",
        ].join("\n");

        this.files.set(`sessions/${dirName}/session.txt`, Buffer.from(sessionTxt));
        this.files.set(`sessions/${dirName}/${streamFile}`, Buffer.alloc(streamBytes, 7));
    }

    private cmdOsInfo(): DeviceResponse {
        const versionString = versionToString(this.osVersion);
        return {
            kind: "object",
            lines: [
                `Version String : ${versionString}`,
                `Version        : ${this.osVersion}`,
                `Board          : iWinks Aurora v1 rev3`,
                `Build Date     : Jan 01 2026 - 00:00:00`,
                `Bytes Free     : 50000`,
                `Battery Level  : ${this.batteryLevel}%`,
                `Running Time   : 0.00 h`,
                `Profile        : ${this.loadedProfile ?? "None"}`,
                `Bootloader Version : ${this.bootloaderVersion}`,
                `BLE Version    : ${this.bleVersion}`,
                `Debug Mode     : OFF`,
            ],
        };
    }

    private cmdEventOutputEnable(maskArg?: string): DeviceResponse {
        const mask = parseInt(maskArg ?? "", 10);
        this.enabledEventMask = Number.isFinite(mask) ? mask : 0;

        if ((this.enabledEventMask & (1 << EventIds.BATTERY_MONITOR)) !== 0) {
            this.clearBatteryTimer();
            this.batteryEventTimer = setTimeout(() => {
                this.emit(DEVICE_EVENT, EventIds.BATTERY_MONITOR, this.batteryLevel);
            }, BATTERY_EVENT_DELAY_MS);
            // 実機と同じく残量を定期通知する。初回通知を取りこぼしても
            // （購読タイミング・再接続）定期分で 0 表示から収束する。
            this.startBatteryInterval();
        }

        return { kind: "plain" };
    }

    private cmdSdDirRead(args: string[]): DeviceResponse {
        const dir = this.resolveDir(args[0]);
        const isFile = parseInt(args[1] ?? "0", 10) === 1;
        const filter = args[2] ?? "";
        const filterRe = filter ? globToRegExp(filter) : undefined;

        const prefix = dir ? `${dir}/` : "";
        const names = new Set<string>();

        for (const key of this.files.keys()) {
            if (!key.startsWith(prefix)) continue;

            const rest = key.slice(prefix.length);
            if (!rest) continue;

            const slashIndex = rest.indexOf("/");
            names.add(slashIndex === -1 ? rest : rest.slice(0, slashIndex));
        }

        const rows: Array<Array<string | number | boolean>> = [];
        for (const name of names) {
            if (filterRe && !filterRe.test(name)) continue;

            const fullKey = `${prefix}${name}`;
            const entry = this.files.get(fullKey);

            if (isFile) {
                if (entry === undefined) continue;
                rows.push([name, true, entry.length]);
            } else {
                rows.push([name, false, 0]);
            }
        }

        rows.sort((a, b) => (String(a[0]) < String(b[0]) ? -1 : 1));

        return { kind: "table", columns: ["name", "isFile", "size"], rows };
    }

    private cmdSdFileRead(args: string[]): DeviceResponse {
        const key = this.fsKey(args[1], args[0]);
        const content = this.files.get(key);

        if (content === undefined) {
            return { kind: "error", error: 3, message: `File not found: ${key}` };
        }

        const compress = parseInt(args[2] ?? "0", 10) === 1;
        const raw = compress
            ? HeatshrinkEncoder.encode(new Uint8Array(content))
            : new Uint8Array(content);

        const chunks: Buffer[] = [];
        for (let offset = 0; offset < raw.byteLength; offset += OUTPUT_CHUNK_MAX) {
            chunks.push(Buffer.from(raw.subarray(offset, offset + OUTPUT_CHUNK_MAX)));
        }

        return {
            kind: "output",
            chunks,
            infoLines: [`crc: ${crc32.unsigned(content)}`],
        };
    }

    private cmdSdFileInfo(args: string[]): DeviceResponse {
        const key = this.fsKey(args[1], args[0]);
        const content = this.files.get(key);

        if (content === undefined) {
            return { kind: "error", error: 3, message: `File not found: ${key}` };
        }

        return {
            kind: "object",
            lines: [`file: ${key}`, `size: ${content.length}`, `crc: ${crc32.unsigned(content)}`],
        };
    }

    private cmdSdFileWrite(args: string[]): DeviceResponse {
        const key = this.fsKey(args[1], args[0]);
        this.pendingWrite = { key, chunks: [], rename: args[2] === "1" };

        clearTimeout(this.inputIdleTimer);
        this.inputIdleTimer = setTimeout(() => {
            this.finishWrite();
        }, INPUT_IDLE_COMPLETE_MS);

        return { kind: "input" };
    }

    private cmdSdRename(args: string[]): DeviceResponse {
        const from = this.normalize(args[0]);
        const to = this.normalize(args[1]);

        for (const key of Array.from(this.files.keys())) {
            if (key === from || key.startsWith(`${from}/`)) {
                const renamed = to + key.slice(from.length);
                const content = this.files.get(key);
                this.files.delete(key);
                if (content !== undefined) {
                    this.files.set(renamed, content);
                }
            }
        }

        return { kind: "plain" };
    }

    private finishWrite(): void {
        const pending = this.pendingWrite;
        this.pendingWrite = undefined;
        this.inputIdleTimer = undefined;

        if (!pending) return;

        const content = Buffer.concat(pending.chunks);
        this.files.set(pending.key, content);

        // GO TO BED では就寝用プロフィール（default.prof）に wakeup-time が書き込まれる。
        // アラームの発火時刻として端末が参照する値を取り込んでおく。
        if (pending.key === "profiles/default.prof") {
            this.wakeupTimeOfDayMs = this.parseWakeupTime(content.toString("ascii"));
        }

        this.emit(WRITE_FINISHED, {
            kind: "object",
            lines: [`crc: ${crc32.unsigned(content)}`, `file: ${pending.key}`],
        });
    }

    private deleteTree(path: string): void {
        const key = this.normalize(path);
        for (const fileKey of Array.from(this.files.keys())) {
            if (fileKey === key || fileKey.startsWith(`${key}/`)) {
                this.files.delete(fileKey);
            }
        }
    }

    /** 書き込み側は name に "profiles/xxx" のようにパスを含むことがあるため、そのまま正規化する。 */
    private normalize(path?: string): string {
        return (path ?? "").replace(/^\/+|\/+$/g, "");
    }

    /** 読み取り側は name と dir が分かれているため、fsKey で結合する。 */
    private fsKey(dir: string | undefined, name: string): string {
        const normalizedDir = this.resolveDir(dir);
        return normalizedDir ? `${normalizedDir}/${name}` : name;
    }

    /**
     * sd-dir-read / sd-file-read の dir 引数を解決する。
     * セッション日時ディレクトリ（"2026-11-14@2200" 等）はアプリ側が "sessions/" 接頭辞なしで
     * 参照するため、"sessions/<dir>" 配下に見つかればそちらへ解決する。
     */
    private resolveDir(dir: string | undefined): string {
        const normalized = this.normalize(dir);
        if (!normalized) return "";
        if (normalized.includes("/")) return normalized;

        if (this.hasChildren(`sessions/${normalized}`)) {
            return `sessions/${normalized}`;
        }

        return normalized;
    }

    private hasChildren(dir: string): boolean {
        const prefix = `${dir}/`;
        for (const key of this.files.keys()) {
            if (key.startsWith(prefix)) return true;
        }
        return false;
    }

    private clearTimers(): void {
        this.clearBatteryTimer();

        if (this.inputIdleTimer !== undefined) {
            clearTimeout(this.inputIdleTimer);
            this.inputIdleTimer = undefined;
        }

        this.cancelSleepScenario();
    }

    private clearBatteryTimer(): void {
        if (this.batteryEventTimer !== undefined) {
            clearTimeout(this.batteryEventTimer);
            this.batteryEventTimer = undefined;
        }
        this.stopBatteryInterval();
    }

    private startBatteryInterval(): void {
        this.stopBatteryInterval();
        this.batteryInterval = setInterval(() => {
            this.emit(DEVICE_EVENT, EventIds.BATTERY_MONITOR, this.batteryLevel);
        }, this.batteryEventIntervalMs);
    }

    private stopBatteryInterval(): void {
        if (this.batteryInterval !== undefined) {
            clearInterval(this.batteryInterval);
            this.batteryInterval = undefined;
        }
    }

    /** プロフィールの `{wakeup-time:<ms-after-midnight>}` を抽出する。 */
    private parseWakeupTime(profileContent: string): number | undefined {
        const start = profileContent.indexOf(PROFILE_WAKEUP_TIME_KEY);
        if (start === -1) return undefined;

        const valueStart = start + PROFILE_WAKEUP_TIME_KEY.length;
        const valueEnd = profileContent.indexOf("}", valueStart);
        if (valueEnd === -1) return undefined;

        const value = Number(profileContent.slice(valueStart, valueEnd));
        return Number.isFinite(value) && value > 0 ? value : undefined;
    }

    /**
     * 就寝シナリオの予約。
     *  - 短縮モード（sleepScenarioSeconds 指定時）: 就寝直後の固定秒数でアラーム発火。
     *  - 実時間モード: プロフィールの wakeup-time の次の到来時刻で発火。
     */
    private scheduleSleepScenario(): void {
        this.cancelSleepScenario();

        let delayMs: number;
        if (this.sleepScenarioSeconds !== undefined) {
            delayMs = this.sleepScenarioSeconds * 1000;
        } else if (this.wakeupTimeOfDayMs !== undefined) {
            const now = new Date();
            const wake = new Date(now);
            wake.setHours(0, 0, 0, 0);
            wake.setTime(wake.getTime() + this.wakeupTimeOfDayMs);

            if (wake.getTime() <= now.getTime()) {
                wake.setTime(wake.getTime() + 24 * 60 * 60 * 1000);
            }
            delayMs = wake.getTime() - now.getTime();
        } else {
            console.debug(
                "[VirtualAuroraDevice] wakeup-time が未設定のため就寝シナリオを開始しません。" +
                    "EXPO_PUBLIC_VIRTUAL_AURORA_FAST=1 で検証用に短縮できます。",
            );
            return;
        }

        console.debug(`[VirtualAuroraDevice] alarm scheduled in ${delayMs}ms`);
        this.alarmTimer = setTimeout(() => {
            this.alarmTimer = undefined;
            this.fireAlarm();
        }, delayMs);
    }

    private fireAlarm(): void {
        // その晩寝た分のセッションを仮想 SD へ生成する。起床後の未転送セッション同期で
        // アプリが読み取り、サーバへ登録（pushSessions）される。
        this.createSleepSession();

        // CLOCK_ALARM_FIRE で AuroraManager が WAKING → Waking 画面へ遷移する
        this.emit(DEVICE_EVENT, EventIds.CLOCK_ALARM_FIRE, 1);

        // 起床時は端末のボタン押下（BUTTON_MONITOR flags=1）で AWAKE へ進む
        this.buttonTimer = setTimeout(() => {
            this.buttonTimer = undefined;
            this.emit(DEVICE_EVENT, EventIds.BUTTON_MONITOR, 1);
        }, this.buttonPressDelayMs);
    }

    /**
     * 就寝シナリオのセッション（session.txt + stream ファイル）を生成する。
     * サンプルセッションと同じ実機フォーマットで、短縮シナリオでも時系列が
     * 壊れないようイベント時刻を duration 内にクランプする。
     */
    private createSleepSession(): void {
        if (this.sleepStartMs === undefined) {
            this.sleepStartMs = Date.now();
        }
        const startedAt = new Date(this.sleepStartMs);
        const durationMs = Math.max(Date.now() - startedAt.getTime(), 1);

        const dirName = `${formatSampleDate(startedAt)}@${String(startedAt.getHours()).padStart(2, "0")}${String(startedAt.getMinutes()).padStart(2, "0")}`;
        const startEpoch = startedAt.getTime();
        const streamFile = `${startEpoch.toString(16)}.dat`;
        const fallAsleepAt = Math.min(300000, Math.floor(durationMs / 4));
        const wakeAt = Math.max(0, durationMs - Math.floor(durationMs / 4));

        const sessionTxt = [
            "version: 30000",
            `date: ${startEpoch}`,
            "profile: default.prof",
            `duration: ${durationMs}`,
            "events.0.id: 1",
            `events.0.time: ${fallAsleepAt}`,
            "events.0.flags: 2",
            "events.1.id: 1",
            `events.1.time: ${wakeAt}`,
            "events.1.flags: 1",
            "streams.0.id: 0",
            "streams.0.time: 0",
            "streams.0.type: BOOL",
            `streams.0.file: ${streamFile}`,
            "streams.0.asleepAt: 1000",
            "",
        ].join("\n");

        this.files.set(`sessions/${dirName}/session.txt`, Buffer.from(sessionTxt));
        this.files.set(
            `sessions/${dirName}/${streamFile}`,
            Buffer.alloc(Math.max(8, Math.floor(durationMs / 3600000) * 8), 7),
        );
    }

    private cancelSleepScenario(): void {
        if (this.alarmTimer !== undefined) {
            clearTimeout(this.alarmTimer);
            this.alarmTimer = undefined;
        }
        if (this.buttonTimer !== undefined) {
            clearTimeout(this.buttonTimer);
            this.buttonTimer = undefined;
        }
    }
}

/** "*", "?" 程度の簡単なグロブ（sd-dir-read のフィルタ）。 */
function globToRegExp(pattern: string): RegExp {
    const escaped = pattern
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*/g, ".*")
        .replace(/\?/g, ".");
    return new RegExp(`^${escaped}$`);
}

/** サンプルセッションのディレクトリ名（YYYY-MM-DD）用のフォーマット。 */
function formatSampleDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
