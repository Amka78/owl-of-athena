/* eslint-disable @typescript-eslint/no-var-requires */
//#region Import Modules

import groupBy from "lodash/groupBy";
import isEqual from "lodash/isEqual";
import { MessageKeys } from "../constants";
import type {
    AuroraProfile,
    AuroraProfileOption,
    LedEffectName,
    SongValue,
    StimLedValue,
} from "../sdk/AuroraTypes";
import { buzzSongObjToCmd, ledEffectObjToCmd } from "../sdk/util";
//#endregion

//#region Types
export type GroupedProfileOptionList = [string, AuroraProfileOption[]][];
export type ProfileOptionValues = Record<string, unknown>;
//#endregion

//#region Functions
export const createOfficialProfile = async (): Promise<AuroraProfile> => {
    // ネイティブでは require() は数値のモジュールID（例: 35）を返し、直接 fetch すると
    // "no protocol: 35" で失敗する（Web だけ URL 文字列になり動いていた）。
    // expo-asset で実 URI に解決してから読み込む。import を関数内に置くのは
    // bun test がトップレベル import のグラフ走査で expo-asset を実解析して落ちるため。
    const { Asset } = require("expo-asset") as typeof import("expo-asset");
    const defaultProfileAsset = Asset.fromModule(
        require("../../assets/profiles/default_profile_content.ttf"),
    );
    await defaultProfileAsset.downloadAsync();
    const response = await fetch(defaultProfileAsset.localUri ?? defaultProfileAsset.uri);
    const profileContent = await response.text();
    const officialProfile: AuroraProfile = {
        id: "F367G2",
        type: "official",
        description:
            "Aurora's default profile providing basic sleep tracking as well as optional Smart Alarm, REM Stimulation, and DSL functionality.",
        name: "default.prof",
        title: "Default Profile",
        min_firmware_version: 20206,
        content: profileContent,
        options: defaultOptions,
        created_at: 1504827468,
        updated_at: 1504827468,
    };
    return officialProfile;
};

export const groupingProfileOptionList = (
    optionsList: AuroraProfileOption[],
): GroupedProfileOptionList => {
    return Object.entries(groupBy(optionsList, "group"));
};

/**
 * サーバーは options を JSONB（配列）で返すが、旧データやキャッシュでは
 * JSON 文字列のこともあるため、どちらでも配列に正規化する。
 */
export const parseProfileOptions = (
    options: AuroraProfileOption[] | string | undefined,
): AuroraProfileOption[] => {
    if (!options) return [];
    if (Array.isArray(options)) return options;
    try {
        const parsed = JSON.parse(options);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export const createProfileOptionValues = (options: AuroraProfileOption[]): ProfileOptionValues => {
    const values: ProfileOptionValues = {};
    for (const option of options) {
        values[option.name] = option.value;
    }
    return values;
};

/** デスクトップ版と同じく、条件は OR、条件内の項目は AND で評価する。 */
export const checkProfileOptionConditions = (
    option: AuroraProfileOption,
    values: ProfileOptionValues,
): boolean => {
    const conditions = option.conditions;

    if (!Array.isArray(conditions) || conditions.length === 0) return true;

    return conditions.some((condition: unknown) => {
        if (!condition || typeof condition !== "object") return false;

        return Object.entries(condition as Record<string, unknown>).every(
            ([conditionOptionName, conditionValue]) => {
                const actual = values[conditionOptionName];
                let operator = "=";
                let expected: unknown = conditionValue;

                if (Array.isArray(conditionValue)) {
                    if (conditionValue.length >= 2) {
                        operator = String(conditionValue[0]);
                        expected = conditionValue[1];
                    } else {
                        expected = conditionValue.length === 1 ? conditionValue[0] : "";
                    }
                }

                if (operator === "=") return valuesEqual(actual, expected);
                if (operator === "!") return !valuesEqual(actual, expected);

                return false;
            },
        );
    });
};

export const isProfileOptionVisibleForRoles = (
    option: AuroraProfileOption,
    roles: string[],
): boolean => {
    if (!Array.isArray(option.roles) || option.roles.length === 0) return true;

    return option.roles.some((role: string) => roles.includes(role));
};

export const createProfileOptionsWithValues = (
    profile: AuroraProfile,
    values: ProfileOptionValues,
): AuroraProfileOption[] => {
    return parseProfileOptions(profile.options).map((option) => ({
        ...option,
        value: (values[option.name] !== undefined
            ? values[option.name]
            : option.value) as AuroraProfileOption["value"],
    }));
};

export const hasProfileUnsavedChanges = (
    profile: AuroraProfile | undefined,
    values: ProfileOptionValues,
): boolean => {
    if (!profile) return false;

    return parseProfileOptions(profile.options).some((option) => {
        const current = values[option.name];
        if (current === undefined) return option.value !== undefined;
        return !valuesEqual(current, option.value);
    });
};

/** content の {name:...} を編集中の値で置き換え、保存可能なプロフィールにする。 */
export const processProfile = (
    profile: AuroraProfile,
    values: ProfileOptionValues,
): AuroraProfile => {
    const options = createProfileOptionsWithValues(profile, values);
    let content = profile.content ?? "";

    for (const option of options) {
        const optionRegex = new RegExp(`{${escapeRegExp(option.name)}:([^}]*)}`, "gi");
        const normalized = normalizeProfileOptionValue(option.value, option.field);
        content = content.replace(optionRegex, () => `{${option.name}:${normalized}}`);
    }

    content = content
        .trim()
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .split("\n")
        .map((line) => line.trim())
        .join("\n")
        .replace(/\n/g, "\r\n");

    return { ...profile, content, options };
};

export const normalizeProfileOptionValue = (
    value: unknown,
    field: AuroraProfileOption["field"],
): string => {
    if (typeof value === "boolean") return value ? "1" : "0";

    if (typeof value === "string") {
        if (value === "true") return "1";
        if (value === "false") return "0";
    }

    switch (field.type) {
        case "time": {
            if (value === undefined || value === null || value === "") return "-1";
            const parsed = typeof value === "number" ? value : parseInt(String(value), 10);
            return Number.isNaN(parsed) ? "-1" : String(parsed);
        }

        case "checkboxes": {
            if (Array.isArray(value)) {
                const mask = value.reduce((result: number, streamId: number) => {
                    return result + (0x00000001 << Number(streamId));
                }, 0);
                return `0x${mask.toString(16).toUpperCase().padStart(8, "0")}`;
            }
            if (typeof value === "number") {
                return `0x${value.toString(16).toUpperCase().padStart(8, "0")}`;
            }
            return value === undefined || value === null ? "" : String(value);
        }

        case "led-effect": {
            if (!value || typeof value !== "object") {
                return typeof value === "string" ? value : "";
            }
            const ledValue = value as StimLedValue;
            if (!ledValue.effect) return "";
            try {
                return ledEffectObjToCmd(ledValue) ?? "";
            } catch {
                return "";
            }
        }

        case "buzz-song": {
            if (!value || typeof value !== "object") {
                return typeof value === "string" ? value : "";
            }
            const songValue = value as SongValue;
            if (!songValue.song) return "";
            try {
                return buzzSongObjToCmd(songValue) ?? "";
            } catch {
                return "";
            }
        }

        case "slider": {
            if (value === undefined || value === null || value === "") return "";
            const numeric = typeof value === "number" ? value : parseFloat(String(value));
            if (Number.isNaN(numeric)) return String(value);

            switch (field.format) {
                case "hours":
                    return String(numeric * 60 * 60 * 1000);
                case "minutes":
                    return String(numeric * 60 * 1000);
                default:
                    return String(numeric);
            }
        }

        default:
            return value === undefined || value === null ? "" : String(value);
    }
};

const valuesEqual = (a: unknown, b: unknown): boolean => {
    if (a === b) return true;
    if (isEqual(a, b)) return true;
    if (a === undefined || a === null || b === undefined || b === null) {
        return (a ?? null) === (b ?? null);
    }
    if (typeof a === "boolean" || typeof b === "boolean") return Boolean(a) === Boolean(b);
    if (typeof a === "object" || typeof b === "object") return false;

    const numericA = Number(a);
    const numericB = Number(b);
    if (!Number.isNaN(numericA) && !Number.isNaN(numericB)) return numericA === numericB;

    return String(a) === String(b);
};

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createProfileTitle = (baseTitle: string, existingTitles: string[]): string => {
    let title = baseTitle.startsWith("My ") ? baseTitle : `My ${baseTitle}`;

    while (existingTitles.includes(title)) {
        const match = title.match(/(.+) (\d+)$/);
        title = match ? `${match[1]} ${parseInt(match[2], 10) + 1}` : `${title} 2`;
    }

    return title;
};

export const createProfileName = (existingNames: string[]): string => {
    let name = `my-${Date.now().toString(36)}.prof`;
    let index = 2;

    while (existingNames.includes(name)) {
        name = `my-${Date.now().toString(36)}-${index}.prof`;
        index += 1;
    }

    return name;
};
//#endregion

//#region Constants
export const stimEnabled: AuroraProfileOption = {
    name: "stim-enabled",
    title: "REM Stimulation",
    description:
        "If enabled, Aurora will provide light and/or sound stimulation whenever REM is detected.\
                      Advanced configuration options allow more control over when and how stimulation is presented.",
    group: "REM Stim Options",
    groupName: MessageKeys.profile_rem_stim_options,
    value: false,
    field: {
        type: "toggle",
    },
};

export const wakeupTime: AuroraProfileOption = {
    name: "wakeup-time",
    title: "Alarm/Wakeup Time",
    description:
        "This is the absolute latest time you wish to be awakened. This time is normally configured\
                        by Aurora Mobile but is provided here in case you do not have access to or do not wish to\
                        use Aurora Mobile.",
    group: "Alarm Options",
    groupName: MessageKeys.profile_alarm_options,
    value: undefined,
    field: {
        type: "time",
        clearable: true,
        labelCleared: "Alarm Not Set",
        minutesStep: 5,
        defaultTime: 25200000,
    },
};

export const saEnabled: AuroraProfileOption = {
    name: "sa-enabled",
    title: "Smart Alarm",
    description:
        "If enabled, Aurora will wake you up at an optimal moment before your scheduled alarm time.\
                      This feature is generally used in conjunction with Aurora Mobile to trigger your alarm early,\
                      however you can trigger light and/or sound directly from the Aurora using\
                      the advanced configuration options.",
    group: "Alarm Options",
    groupName: MessageKeys.profile_alarm_options,
    value: false,
    conditions: [{ "wakeup-time": ["!", null] }],
    failedConditionMessage: "You must configure a wakeup time first.",
    field: {
        type: "toggle",
    },
};

export const dslEnabled: AuroraProfileOption = {
    name: "dsl-enabled",
    title: "Dawn Simulating Light Therapy",
    description:
        "If enabled, Aurora will slowly fade in blue light leading up to your scheduled alarm time.\
                      Blue light in the morning prepares the body to awaken, activating your natural circadian rhythm.\
                      This feature is generally used in conjunction with Aurora Mobile.",
    group: "Alarm Options",
    groupName: MessageKeys.profile_alarm_options,
    value: false,
    conditions: [{ "wakeup-time": ["!", null] }],
    failedConditionMessage: "You must configure a wakeup time first.",
    field: {
        type: "toggle",
    },
};

export const fileOutput: AuroraProfileOption = {
    name: "file-output",
    title: "Save Data Streams to File",
    value: "0x04",
    description:
        "If enabled, Aurora will save sensor data collected during sleep sessions to internal storage.\
                     This data can then be synced to the cloud using Aurora Desktop and made available for download.\
                     Additionally, this data is used to improve the accuracy and performance of Aurora's various algorithms./",
    group: "Misc Options",
    groupName: MessageKeys.profile_misc_options,
    field: {
        type: "toggle",
        valueEnabled: "0x04",
        valueDisabled: "0x00",
    },
};

export const stimLed: AuroraProfileOption = {
    name: "stim-led",
    title: "LED REM Stimulation",
    description: "The LED stimulus presented during REM.",
    value: {
        effect: "blink",
        eyes: "both",
        color: "#FF0000",
        brightness: 100,
        blinkRate: 0.5,
        blinkCount: 5,
    },
    group: "REM Stim Options",
    groupName: MessageKeys.profile_rem_stim_options,
    advanced: true,
    conditions: [{ "stim-enabled": true }],
    failedConditionMessage: "You must enable REM stimulations first.",
    field: {
        type: "led-effect",
    },
};

export const stimBuzz: AuroraProfileOption = {
    name: "stim-buzz",
    title: "Buzzer REM Stimulation",
    description: "The buzzer song played during REM.",
    value: { song: undefined },
    group: "REM Stim Options",
    groupName: MessageKeys.profile_rem_stim_options,
    advanced: true,
    conditions: [{ "stim-enabled": true }],
    failedConditionMessage: "You must enable REM stimulations first.",
    field: {
        type: "buzz-song",
    },
};

export const stimDelay: AuroraProfileOption = {
    name: "stim-delay",
    title: "REM Stimulation Delay",
    description: "The initial amount of time to wait before presenting REM stimulations.",
    group: "REM Stim Options",
    groupName: MessageKeys.profile_rem_stim_options,
    value: 4,
    advanced: true,
    conditions: [{ "stim-enabled": true }],
    failedConditionMessage: "You must enable REM stimulations first.",
    field: {
        type: "slider",
        format: "hours",
        min: 0,
        max: 10,
        step: 0.5,
        labelMin: "No delay",
    },
};

export const stimInterval: AuroraProfileOption = {
    name: "stim-interval",
    title: "REM Stim Repeat Interval",
    description: "Minimum amount of time between successive REM stimulations.",
    group: "REM Stim Options",
    groupName: MessageKeys.profile_rem_stim_options,
    advanced: true,
    value: 5,
    conditions: [{ "stim-enabled": true }],
    failedConditionMessage: "You must enable REM stimulations first.",
    field: {
        type: "slider",
        format: "minutes",
        min: 1,
        max: 60,
        step: 1,
    },
};

export const wakeupWindow: AuroraProfileOption = {
    name: "wakeup-window",
    title: "Smart Alarm / DSL Window",
    description:
        "Controls the amount of time before your scheduled alarm time to begin DSL therapy or to allow the\
                     smart alarm to awaken you.",
    group: "Alarm Options",
    groupName: MessageKeys.profile_alarm_options,
    value: 30,
    advanced: true,
    conditions: [{ "wakeup-time": ["!", null] }],
    failedConditionMessage: "You must configure a wakeup time first.",
    field: {
        type: "slider",
        format: "minutes",
        min: 5,
        max: 60,
        step: 5,
    },
};

export const wakeupLed: AuroraProfileOption = {
    name: "wakeup-led",
    title: "LED Wakeup Alarm",
    description: "The LED stimulus presented at alarm time.",
    advanced: true,
    value: undefined,
    group: "Alarm Options",
    groupName: MessageKeys.profile_alarm_options,
    conditions: [{ "wakeup-time": ["!", null] }],
    failedConditionMessage: "You must configure a wakeup time first.",
    field: {
        type: "led-effect",
    },
};

export const wakeupBuzz: AuroraProfileOption = {
    name: "wakeup-buzz",
    title: "Buzzer Wakeup Alarm",
    description: "The buzzer song played at alarm time.",
    value: { song: undefined },
    advanced: true,
    group: "Alarm Options",
    groupName: MessageKeys.profile_alarm_options,
    conditions: [{ "wakeup-time": ["!", null] }],
    failedConditionMessage: "You must configure a wakeup time first.",
    field: {
        type: "buzz-song",
    },
};

export const fileStream: AuroraProfileOption = {
    name: "file-streams",
    title: "Data Streams to Save to File",
    description:
        "Sensor data (streams) to save to file. Avoid enabling too many streams as it decreases battery life and increases sync time.",
    value: [0, 1, 10, 17, 18, 19, 20, 21, 22, 23, 24],
    group: "Misc Options",
    groupName: MessageKeys.profile_misc_options,
    advanced: true,
    conditions: [{ "file-output": 2 }, { "file-output": 4 }],
    failedConditionMessage: "You must enable stream file saving first.",
    field: {
        type: "checkboxes",
        choices: "streams",
        labelNone: "No streams",
    },
};

export const streamDebug: AuroraProfileOption = {
    name: "stream-debug",
    title: "Stream Debug Mode (Developers Only)",
    advanced: true,
    developer: true,
    value: false,
    description:
        "If enabled, Aurora will replace sensor values with incrementing values and\
                      replace sleep stages predicted by the sleep staging algorithm with randomly\
                      chosen stages.",
    group: "Misc Options",
    groupName: MessageKeys.profile_misc_options,
    roles: ["admin"],
    field: {
        type: "toggle",
    },
};

export const LED_EFFECT_DEFAULTS: Record<LedEffectName, StimLedValue> = {
    set: {
        effect: "set",
        eyes: "both",
        color: "#FF0000",
        brightness: 100,
        shutoffDelay: 5,
    },
    blink: {
        effect: "blink",
        eyes: "both",
        color: "#FF0000",
        brightness: 100,
        blinkRate: 0.5,
        blinkCount: 5,
        shutoffDelay: 0,
    },
    alternate: {
        effect: "alternate",
        state1Eyes: "both",
        state1Color: "#FF0000",
        state1Brightness: 100,
        state1Duration: 1,
        state2Eyes: "both",
        state2Color: "#00FF00",
        state2Brightness: 100,
        state2Duration: 0.5,
        alternateCount: 4,
        shutoffDelay: 0,
    },
    transition: {
        effect: "transition",
        state1Eyes: "both",
        state1Color: "#FF0000",
        state1Brightness: 100,
        state2Eyes: "both",
        state2Color: "#0000FF",
        state2Brightness: 100,
        transitionDuration: 5,
        transitionRewind: true,
        shutoffDelay: 0,
    },
};

export const BUZZ_SONG_DEFAULTS: Required<
    Pick<SongValue, "repeat" | "volume" | "tempoAdjust" | "pitchAdjust">
> = {
    repeat: 0,
    volume: 100,
    tempoAdjust: 1,
    pitchAdjust: 0,
};

export const defaultOptions: AuroraProfileOption[] = [
    stimEnabled,
    wakeupTime,
    saEnabled,
    dslEnabled,
    fileOutput,
    stimDelay,
    stimLed,
    stimBuzz,
    stimInterval,
    wakeupWindow,
    wakeupLed,
    wakeupBuzz,
    fileStream,
    streamDebug,
];
//#endregion
