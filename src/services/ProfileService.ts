/* eslint-disable @typescript-eslint/no-var-requires */
import { AuroraProfile, AuroraProfileOptions } from "../sdk/AuroraTypes";

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
        options: options,
        created_at: 1504827468,
        updated_at: 1504827468,
    };
    return officialProfile;
};

const options: AuroraProfileOptions[] = [
    {
        name: "stim-enabled",
        title: "REM Stimulation",
        description:
            "If enabled, Aurora will provide light and/or sound stimulation whenever REM is detected.\
                      Advanced configuration options allow more control over when and how stimulation is presented.",
        group: "REM Stim Options",
        value: false,
        field: {
            type: "toggle",
        },
    },

    {
        name: "wakeup-time",
        title: "Alarm/Wakeup Time",
        description:
            "This is the absolute latest time you wish to be awakened. This time is normally configured\
                        by Aurora Mobile but is provided here in case you do not have access to or do not wish to\
                        use Aurora Mobile.",
        group: "Alarm Options",
        value: undefined,
        field: {
            type: "time",
            clearable: true,
            labelCleared: "Alarm Not Set",
            minutesStep: 5,
            defaultTime: 25200000,
        },
    },

    {
        name: "sa-enabled",
        title: "Smart Alarm",
        description:
            "If enabled, Aurora will wake you up at an optimal moment before your scheduled alarm time.\
                      This feature is generally used in conjunction with Aurora Mobile to trigger your alarm early,\
                      however you can trigger light and/or sound directly from the Aurora using\
                      the advanced configuration options.",
        group: "Alarm Options",
        value: false,
        conditions: [{ "wakeup-time": ["!", null] }],
        failedConditionMessage: "You must configure a wakeup time first.",
        field: {
            type: "toggle",
        },
    },

    {
        name: "dsl-enabled",
        title: "Dawn Simulating Light Therapy",
        description:
            "If enabled, Aurora will slowly fade in blue light leading up to your scheduled alarm time.\
                      Blue light in the morning prepares the body to awaken, activating your natural circadian rhythm.\
                      This feature is generally used in conjunction with Aurora Mobile.",
        group: "Alarm Options",
        value: false,
        conditions: [{ "wakeup-time": ["!", null] }],
        failedConditionMessage: "You must configure a wakeup time first.",
        field: {
            type: "toggle",
        },
    },

    {
        name: "file-output",
        title: "Save Data Streams to File",
        value: "0x04",
        description:
            "If enabled, Aurora will save sensor data collected during sleep sessions to internal storage.\
                     This data can then be synced to the cloud using Aurora Desktop and made available for download.\
                     Additionally, this data is used to improve the accuracy and performance of Aurora's various algorithms./",
        group: "Misc Options",
        field: {
            type: "toggle",
            valueEnabled: "0x04",
            valueDisabled: "0x00",
        },
    },

    {
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
        advanced: true,
        conditions: [{ "stim-enabled": true }],
        failedConditionMessage: "You must enable REM stimulations first.",
        field: {
            type: "led-effect",
        },
    },

    {
        name: "stim-buzz",
        title: "Buzzer REM Stimulation",
        description: "The buzzer song played during REM.",
        value: { song: undefined },
        group: "REM Stim Options",
        advanced: true,
        conditions: [{ "stim-enabled": true }],
        failedConditionMessage: "You must enable REM stimulations first.",
        field: {
            type: "buzz-song",
        },
    },

    {
        name: "stim-delay",
        title: "REM Stimulation Delay",
        description:
            "The initial amount of time to wait before presenting REM stimulations.",
        group: "REM Stim Options",
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
    },

    {
        name: "stim-interval",
        title: "REM Stim Repeat Interval",
        description:
            "Minimum amount of time between successive REM stimulations.",
        group: "REM Stim Options",
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
    },
    {
        name: "wakeup-window",
        title: "Smart Alarm / DSL Window",
        description:
            "Controls the amount of time before your scheduled alarm time to begin DSL therapy or to allow the\
                     smart alarm to awaken you.",
        group: "Alarm Options",
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
    },
    {
        name: "wakeup-led",
        title: "LED Wakeup Alarm",
        description: "The LED stimulus presented at alarm time.",
        advanced: true,
        value: undefined,
        group: "Alarm Options",
        conditions: [{ "wakeup-time": ["!", null] }],
        failedConditionMessage: "You must configure a wakeup time first.",
        field: {
            type: "led-effect",
        },
    },

    {
        name: "wakeup-buzz",
        title: "Buzzer Wakeup Alarm",
        description: "The buzzer song played at alarm time.",
        value: { song: undefined },
        advanced: true,
        group: "Alarm Options",
        conditions: [{ "wakeup-time": ["!", null] }],
        failedConditionMessage: "You must configure a wakeup time first.",
        field: {
            type: "buzz-song",
        },
    },

    {
        name: "file-streams",
        title: "Data Streams to Save to File",
        description:
            "Sensor data (streams) to save to file. Avoid enabling too many streams as it decreases battery life and increases sync time.",
        value: [0, 1, 10, 17, 18, 19, 20, 21, 22, 23, 24],
        group: "Misc Options",
        advanced: true,
        conditions: [{ "file-output": 2 }, { "file-output": 4 }],
        failedConditionMessage: "You must enable stream file saving first.",
        field: {
            type: "checkboxes",
            choices: "streams",
            labelNone: "No streams",
        },
    },
    {
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
        roles: ["admin"],
        field: {
            type: "toggle",
        },
    },
];
