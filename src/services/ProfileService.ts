/* eslint-disable @typescript-eslint/no-var-requires */
//#region Import Modules
import { AuroraProfile, AuroraProfileOption } from "../sdk/AuroraTypes";
import groupBy from "lodash/groupBy";
import { MessageKeys } from "../constants";
//#endregion

//#region Types
export type GroupedProfileOptionList = [string, AuroraProfileOption[]][];
//#endregion

//#region Functions
export const createOfficialProfile = async (): Promise<AuroraProfile> => {
    const defaultProfileTxt = require("../../assets/profiles/default_profile_content.ttf");
    const response = await fetch(defaultProfileTxt);
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
    optionsList: AuroraProfileOption[]
): GroupedProfileOptionList => {
    return Object.entries(groupBy(optionsList, "group"));
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
    description:
        "The initial amount of time to wait before presenting REM stimulations.",
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

export const defaultOptions: AuroraProfileOption[] = [
    stimEnabled,
    wakeupTime,
    saEnabled,
    dslEnabled,
    fileOutput,
    stimLed,
    stimBuzz,
    stimInterval,
    wakeupWindow,
    wakeupLed,
    wakeupBuzz,
    streamDebug,
];
//#endregion
