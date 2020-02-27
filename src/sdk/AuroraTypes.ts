import { AuroraBluetooth } from "./AuroraBluetooth";
import { AuroraUsb } from "./AuroraUsb";
import { ConnectorTypes } from "./AuroraConstants";
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

export type FirmwareInformation = {
    bootloaderVersion?: number;
    bleVersion?: number;
    version: number;
};
export type AuroraEvent = {
    eventId: number;
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
