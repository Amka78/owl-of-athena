import { AuroraBluetooth } from "./AuroraBluetooth";
import { AuroraUsb } from "./AuroraUsb";
import { ConnectorTypes, EventIds } from "./AuroraConstants";
import Stream from "stream";

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
    content?: string;
    name?: string;
    id?: string;
    key?: string;
    type?: string;
    description?: string;
    title?: string;
    updatedAt?: Date;
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

export type AuroraSessionJson = {
    id: string;
    user_id: string;
    aurora_profile_id: string;
    aurora_profile_name: string;
    firmware_version: number;
    app_platform: string;
    app_version: number;
    sleep_onset: number;
    session_duration: number;
    sleep_duration: number;
    no_signal_duration: number;
    awake_duration: number;
    light_duration: number;
    deep_duration: number;
    rem_duration: number;
    sleep_score: number;
    incomplete: boolean;
    starred: boolean;
    notes?: string;
    asleep_at: number;
    awake_at: number;
    create_at: number;
    session_at: number;
    session_url: string;
    session_txt: string;
};

export type FileInfo = {
    file: string;
    size?: number;
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
