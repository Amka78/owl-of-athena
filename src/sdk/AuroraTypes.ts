//#region Import Modules
import { AuroraBluetooth } from "./AuroraBluetooth";
import { AuroraUsb } from "./AuroraUsb";
import { ConnectorTypes, EventIds } from "./AuroraConstants";
import Stream from "stream";
//#endregion

//#region Types
export type AuroraResponse = {
    origin?: string;
    error: boolean;
    response?: unknown;
};

export type EventResponse = {
    ble: boolean;
    console: boolean;
    count: number;
    event: string;
    handler: boolean;
    id: number;
    log: boolean;
    outputMask: number;
    profile: boolean;
    session: boolean;
};

export type AuroraEvent = {
    eventId: EventIds;
    event: string;
    flags: number;
    time: number;
    origin?: string;
};

export type AuroraProfile = {
    active?: boolean;
    content: string;
    name: string;
    id: string;
    key?: string;
    type: "community" | "official" | "private";
    description?: string;
    title: string;
    created_at: number;
    updated_at: number;
    starred?: boolean;
    created_by?: string;
    parent_profile_id?: string;
    min_firmware_version: number;
    options: AuroraProfileOptions[] | string;
};

export type AuroraProfileOptions = {
    name:
        | "stim-enabled"
        | "wakeup-time"
        | "sa-enabled"
        | "dsl-enabled"
        | "file-output"
        | "stim-led"
        | "stim-buzz"
        | "stim-delay"
        | "stim-interval"
        | "wakeup-window"
        | "wakeup-led"
        | "wakeup-buzz"
        | "file-streams"
        | "stream-debug";
    title: string;
    description: string;
    group: "REM Stim Options" | "Alarm Options" | "Misc Options";
    conditions?: any;
    failedConditionMessage?: string;
    value?: boolean | string | number | number[] | StimLedValue | SongValue;
    advanced?: boolean;
    developer?: boolean;
    roles?: any;
    field:
        | CheckBoxField
        | ToggleField
        | TimeField
        | LedEffectField
        | BuzzSongField
        | SliderField;
};

type SongValue = {
    song?: string;
};

type StimLedValue = {
    effect: string;
    eyes: string;
    color: string;
    brightness: number;
    blinkRate: number;
    blinkCount: number;
};

type CheckBoxField = {
    type: "checkboxes";
    choices: string;
    labelNone: string;
};

type SliderField = {
    type: "slider";
    format: "hours" | "minutes";
    min: number;
    max: number;
    step: number;
    labelMin?: string;
};

type BuzzSongField = {
    type: "buzz-song";
};

type LedEffectField = {
    type: "led-effect";
};

type ToggleField = {
    type: "toggle";
    valueEnabled?: string;
    valueDisabled?: string;
};

type TimeField = {
    type: "time";
    clearable: boolean;
    labelCleared: string;
    minutesStep: number;
    defaultTime: number;
};

export type BluetoothStream = {
    streamId: number;
    stream: string;
    data: number[];
    time: number;
    origin?: string;
};

export type CommandResolverType = (
    value?: void | PromiseLike<void> | undefined | CommandResult<any>
) => void;
export type CommandRejectType = (rejected?: any) => void;
export type Command = {
    commandStr: string;
    connectorType: ConnectorTypes;
    connector?: AuroraBluetooth | AuroraUsb;
    onCmdBegin?: Function;
    onCmdEnd?: Function;
    resolve: CommandResolverType;
    reject: CommandRejectType;
    inputStream?: Stream.Writable;
    outputStream?: Stream.Readable;
};

export type CommandResult<T> = {
    origin?: string;
    args?: string[];
    command?: string;
    connectorType?: ConnectorTypes;
    connector?: AuroraBluetooth | AuroraUsb;
    error?: boolean;
    response?: T;
    inputStream?: Stream.Writable;
    outputStream?: Stream.Readable;
    beginTime?: number;
    endTime?: number;
};

export type WriteFileResponse = {
    file: string;
    ultProf: number;
    size: string;
};

type AuroraSessionCore = {
    app_platform: string;
    app_version: number;
    incomplete: boolean;
};

export type AuroraSessionJson = {
    type: "json";
    id: string;
    user_id: string;
    aurora_profile_id: string;
    aurora_profile_name: string;
    firmware_version: number;
    sleep_onset: number;
    session_duration: number;
    sleep_duration: number;
    no_signal_duration: number;
    awake_duration: number;
    light_duration: number;
    deep_duration: number;
    rem_duration: number;
    sleep_score: number;
    starred: boolean;
    notes?: string;
    asleep_at: number;
    awake_at: number;
    create_at: number;
    session_at: number;
    session_url: string;
    session_txt: string;
} & AuroraSessionCore;

export type AuroraSessionCSV = {
    type: "csv";
    asleespAt: number;
    auroraDir: string;
    awakeAt: number;
    awakening: number;
    content: string;
    profile: AuroraProfile;
    date: number;
    duration: number;
    events: Array<AuroraEventJson>;
    incomplete: boolean;
    name: string;
    session_txt: string;
    sleepDuration: SleepDuration;
    sleepOnset: number;
    sleepScore: number;
    streams: Array<AuroraStreamJson>;
    version: number;
} & AuroraSessionCore;

type SleepDuration = {
    total: number;
    rem: number;
    unknown: number;
    awake: number;
    light: number;
    deep: number;
};

export type FileInfo = {
    compressedSize?: number;
    compressionRatio?: number;
    file: string;
    size?: number;
    crc?: number;
};

export type DirectoryInfo = {
    isFile: boolean;
    name: string;
    size: number;
};

export type AuroraStreamJson = {
    aurora_session_id: string;
    aurora_stream_id: number;
    config: string;
    data_type: number;
    duration: number;
    file: string;
    id: number;
    stream_at: number;
    url: string;
    user_id: string;
};

export type AuroraEventJson = {
    aurora_event_id: number;
    bins: Array<any>;
    event_at: number;
    flags: number;
    id: number;
    time: number;
};
//#endregion
