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
    key: string;
    type: "community" | "official" | "private";
    description?: string;
    title: string;
    updatedAt?: Date;
    starred: boolean;
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
