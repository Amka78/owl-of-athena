//#region Import Modules
import { Platform, Share } from "react-native";

import type { AuroraProfile } from "../sdk/AuroraTypes";
import type { AuroraEvent, AuroraSession, AuroraSessionDetail, AuroraStream } from "../sdk/models";
import { formatLogEntries, type LogEntry } from "./LogService";

//#endregion

//#region Types
type ExportedEvent = {
    type: string;
    eventAt: number;
    flags: number;
    time: number;
};

export type LogReportInfo = {
    appVersion?: string;
    build?: string;
    platform?: string;
    osVersion?: string;
};
//#endregion

//#region Builders
export const buildSessionExportJson = (
    session: AuroraSession,
    detail: AuroraSessionDetail | undefined,
): string => {
    return JSON.stringify(
        {
            app: "owl-of-athena",
            exportedAt: new Date().toISOString(),
            session: serializeSession(session),
            detail: detail ? serializeSessionDetail(detail) : null,
        },
        null,
        2,
    );
};

export const buildSessionEventsCsv = (
    session: AuroraSession,
    detail: AuroraSessionDetail | undefined,
): string => {
    const events: ExportedEvent[] = [];

    if (detail) {
        events.push(...toCsvEvents("sleep", detail.sleepEvents));
        events.push(...toCsvEvents("movement", detail.movementEvents));
        events.push(...toCsvEvents("stim", detail.stimEvents));
        events.push(...toCsvEvents("awakening", detail.awakeningEvents));
        events.push(...toCsvEvents("button", detail.buttonEvents));
    }

    events.sort((a, b) => a.eventAt - b.eventAt);

    const rows = [
        ["session_id", session.id],
        ["sleep_score", String(session.sleepScore)],
        ["session_at", new Date(session.sessionAt ?? 0).toISOString()],
        [],
        ["type", "event_at", "flags", "time"],
        ...events.map((event) => [
            event.type,
            new Date(event.eventAt).toISOString(),
            String(event.flags),
            String(event.time),
        ]),
    ];

    return rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
};

export const buildProfileExportContent = (profile: AuroraProfile | undefined): string => {
    return profile?.content ?? "";
};

export const buildLogReport = (logs: LogEntry[], info: LogReportInfo = {}): string => {
    const header = [
        "owl-of-athena log report",
        `exported_at: ${new Date().toISOString()}`,
        `app_version: ${info.appVersion ?? "unknown"}`,
        `build: ${info.build ?? "unknown"}`,
        `platform: ${info.platform ?? "unknown"}`,
        `os_version: ${info.osVersion ?? "unknown"}`,
        `entries: ${logs.length}`,
        "",
    ];

    return [...header, formatLogEntries(logs)].join("\n");
};
//#endregion

//#region Sharing
/**
 * ネイティブは OS の共有シート、Web は Web Share API →
 * 使えなければ clipboard にフォールバックする。
 */
export const shareText = async (title: string, message: string): Promise<void> => {
    if (Platform.OS === "web") {
        const navigator = (globalThis as { navigator?: any }).navigator;

        if (navigator?.share) {
            await navigator.share({ title, text: message });
            return;
        }
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(message);
            return;
        }

        throw new Error("Sharing is not supported in this browser.");
    }

    await Share.share({ title, message });
};
//#endregion

//#region Private Functions
const serializeSession = (session: AuroraSession): Record<string, unknown> => ({
    id: session.id,
    userId: session.userId,
    auroraProfileId: session.auroraProfileId,
    auroraProfileName: session.auroraProfileName,
    firmwareVersion: session.firmwareVersion,
    appPlatform: session.appPlatform,
    appVersion: session.appVersion,
    sleepOnset: session.sleepOnset,
    sessionDuration: session.sessionDuration,
    sleepDuration: session.sleepDuration,
    noSignalDuration: session.noSignalDuration,
    awakeDuration: session.awakeDuration,
    lightDuration: session.lightDuration,
    deepDuration: session.deepDuration,
    remDuration: session.remDuration,
    sleepScore: session.sleepScore,
    incomplete: session.incomplete,
    starred: session.starred,
    notes: session.notes,
    asleepAt: session.asleepAt,
    awakeAt: session.awakeAt,
    createAt: session.createAt,
    sessionAt: session.sessionAt,
    sessionUrl: session.sessionUrl,
});

const serializeSessionDetail = (detail: AuroraSessionDetail): Record<string, unknown> => ({
    sessionId: detail.sessionId,
    streams: detail.streams.map(serializeStream),
    sleepEvents: detail.sleepEvents.map(serializeEvent),
    movementEvents: detail.movementEvents.map(serializeEvent),
    stimEvents: detail.stimEvents.map(serializeEvent),
    awakeningEvents: detail.awakeningEvents.map(serializeEvent),
    buttonEvents: detail.buttonEvents.map(serializeEvent),
});

const serializeEvent = (event: AuroraEvent): Record<string, unknown> => ({
    auroraEventId: event.auroraEventId,
    bins: event.bins,
    eventAt: event.eventAt,
    flags: event.flags,
    id: event.id,
    time: event.time,
});

const serializeStream = (stream: AuroraStream): Record<string, unknown> => ({
    auroraSessionId: stream.auroraSessionId,
    auroraStreamId: stream.auroraStreamId,
    config: stream.config,
    dataType: stream.dataType,
    duration: stream.duration,
    file: stream.file,
    id: stream.id,
    streamAt: stream.streamAt,
    url: stream.url,
    userId: stream.userId,
});

const toCsvEvents = (type: string, events: AuroraEvent[]): ExportedEvent[] => {
    return events.map((event) => ({
        type,
        eventAt: event.eventAt,
        flags: event.flags,
        time: event.time,
    }));
};

const escapeCsv = (value: string | undefined): string => {
    if (value === undefined) return "";

    return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
};
//#endregion
