import { AuroraBluetooth } from "./AuroraBluetooth";
import { AuroraUsb } from "./AuroraUsb";
import { ConnectorTypes, EventIds } from "./AuroraConstants";
import Stream from "stream";
export type AuroraCommand = {
    command: unknown;
    response?: unknown;
    error: boolean;
    origin?: string;
};

export type AuroraResponse = {
    origin?: string;
    error?: unknown;
    response?: unknown;
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

export type CmdQueue = {
    origin?: string;
    args?: string[];
    command?: string;
    commandStr?: string;
    connector?: AuroraBluetooth | AuroraUsb;
    connectorType?: ConnectorTypes;
    error?: unknown;
    onCmdBegin?: Function;
    onCmdEnd?: Function;
    resolve?: Function;
    reject?: Function;
    response?: unknown;
    inputStream?: Stream.Writable;
    outputStream?: Stream.Readable;
    beginTime?: number;
    endTime?: number;
};
