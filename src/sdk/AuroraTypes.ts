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
