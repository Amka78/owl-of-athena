const AURORA_USB_VID = "0x0483";
const AURORA_USB_SERIAL_PID = "0x5740";
const AURORA_USB_MSD_PID = "0xABED";

const MSD_DRIVE_NAME = "Aurora Drive";

const LOW_BATTERY_THRESHOLD = 25;

const BLE_CMD_MAX_PACKET_LENGTH = 20;

const BLE_CMD_MAX_PAYLOAD = 120;

enum BleCmdStates {
    IDLE = 0,
    CMD_EXECUTE = 1,
    CMD_RESP_OBJECT_READY = 2,
    CMD_RESP_TABLE_READY = 3,
    CMD_INPUT_REQUESTED = 4,
}

enum CommandNames {
    EVENT_OUTPUT_ENABLE = "event-output-enable ",
    EVENT_OUTPUT_DISABLE = "event-output-disable",
    PROF_UNLOAD = "prof-unload",
}

enum ConnectorTypes {
    BLUETOOTH = "bluetooth",
    USB = "usb",
    ANY = "any",
}

const BleAuroraService = "6175726f7261454daf7942b381af0204";

const BleAuroraChars = {
    AURORA_EVENT_INDICATED: "6175726f726149ce8077a614a0dda570",
    AURORA_EVENT_NOTIFIED: "6175726f726149ce8077a614a0dda571",

    CMD_DATA: "6175726f726149ce8077b954b033c880",
    CMD_STATUS: "6175726f726149ce8077b954b033c881",
    CMD_OUTPUT_INDICATED: "6175726f726149ce8077b954b033c882",
    CMD_OUTPUT_NOTIFIED: "6175726f726149ce8077b954b033c883",

    STREAM_DATA_INDICATED: "6175726f726149ce8077b954b033c890",
    STREAM_DATA_NOTIFIED: "6175726f726149ce8077b954b033c891",
};
enum DataTypes {
    UNKNOWN = 0,
    BOOL = 1,
    CHAR = 2,
    UINT8 = 3,
    INT8 = 4,
    UINT16 = 5,
    INT16 = 6,
    UINT32 = 7,
    INT32 = 8,
    FLOAT = 9,
    STR = 10,
    PTR = 11,
}

enum EventIds {
    SIGNAL_MONITOR = 0,
    SLEEP_TRACKER_MONITOR = 1,
    MOVEMENT_MONITOR = 2,
    STIM_PRESENTED = 3,

    AWAKENING = 4,
    AUTO_SHUTDOWN = 5,
    SMART_ALARM = 6,
    EVENT_RESERVED1 = 7,

    EVENT_RESERVED2 = 8,
    EVENT_RESERVED3 = 9,
    EVENT_RESERVED4 = 10,
    EVENT_RESERVED5 = 11,

    EVENT_RESERVED6 = 12,
    EVENT_RESERVED7 = 13,
    EVENT_RESERVED8 = 14,
    EVENT_RESERVED9 = 15,

    BUTTON_MONITOR = 16,
    SDCARD_MONITOR = 17,
    USB_MONITOR = 18,
    BATTERY_MONITOR = 19,

    BUZZ_MONITOR = 20,
    LED_MONITOR = 21,
    EVENT_RESERVED11 = 22,
    EVENT_RESERVED12 = 23,

    BLE_MONITOR = 24,
    BLE_NOTIFY = 25,
    BLE_INDICATE = 26,
    CLOCK_ALARM_FIRE = 27,

    CLOCK_TIMER0_FIRE = 28,
    CLOCK_TIMER1_FIRE = 29,
    CLOCK_TIMER2_FIRE = 30,
    CLOCK_TIMER_FIRE = 31,
}

const EventIdsToNames = {
    [EventIds.SIGNAL_MONITOR]: "signal-monitor",
    [EventIds.SLEEP_TRACKER_MONITOR]: "st-monitor",
    [EventIds.MOVEMENT_MONITOR]: "movement-monitor",
    [EventIds.STIM_PRESENTED]: "stim-presented",

    [EventIds.AWAKENING]: "awakening",
    [EventIds.SMART_ALARM]: "smartalarm",
    [EventIds.AUTO_SHUTDOWN]: "auto-shutdown",
    [EventIds.EVENT_RESERVED1]: "rsvd1",
    [EventIds.EVENT_RESERVED2]: "rsvd2",

    [EventIds.EVENT_RESERVED3]: "rsvd3",
    [EventIds.EVENT_RESERVED4]: "rsvd4",
    [EventIds.EVENT_RESERVED5]: "rsvd5",
    [EventIds.EVENT_RESERVED6]: "rsvd6",

    [EventIds.EVENT_RESERVED7]: "rsvd7",
    [EventIds.EVENT_RESERVED8]: "rsvd8",
    [EventIds.EVENT_RESERVED9]: "rsvd9",

    [EventIds.BUTTON_MONITOR]: "button-monitor",
    [EventIds.SDCARD_MONITOR]: "sdcard-monitor",
    [EventIds.USB_MONITOR]: "usb-monitor",
    [EventIds.BATTERY_MONITOR]: "batt-monitor",

    [EventIds.BUZZ_MONITOR]: "buzz-monitor",
    [EventIds.LED_MONITOR]: "led-monitor",
    [EventIds.EVENT_RESERVED11]: "rsvd11",
    [EventIds.EVENT_RESERVED12]: "rsvd12",

    [EventIds.BLE_MONITOR]: "ble-monitor",
    [EventIds.BLE_NOTIFY]: "ble-notify",
    [EventIds.BLE_INDICATE]: "ble-indicate",
    [EventIds.CLOCK_ALARM_FIRE]: "clock-alarm-fire",

    [EventIds.CLOCK_TIMER0_FIRE]: "clock-timer0-fire",
    [EventIds.CLOCK_TIMER1_FIRE]: "clock-timer1-fire",
    [EventIds.CLOCK_TIMER2_FIRE]: "clock-timer2-fire",
    [EventIds.CLOCK_TIMER_FIRE]: "clock-timer-fire",
};

const EVENT_ID_MAX = 31;

const EventOutputIds = {
    USB: 0,
    LOG: 1,
    SESSION_FILE: 2,
    PROFILE: 3,
    BLUETOOTH: 4,
};

const StreamIds = {
    SIGNAL_QUALITY: 0,
    RAW_EEG: 1,
    HEART_RATE: 2,
    ACCEL_X: 3,

    ACCEL_Y: 4,
    ACCEL_Z: 5,
    GYRO_X: 6,
    GYRO_Y: 7,

    GYRO_Z: 8,
    TEMPERATURE: 9,
    BATTERY: 10,
    STREAM_RESERVED1: 11,

    STREAM_RESERVED2: 12,
    STREAM_RESERVED3: 13,
    STREAM_RESERVED4: 14,
    STREAM_RESERVED5: 15,

    SLEEP_FEATURES: 16,
    SLEEP_STAGES: 17,
    SLEEP_TRACKER: 18,
    EEG_DELTA: 19,

    EEG_THETA: 20,
    EEG_ALPHA: 21,
    EEG_BETA: 22,
    EEG_GAMMA: 23,

    ACCEL_MAGNITUDE: 24,
    GYRO_MAGNITUDE: 25,
    ROTATION_ROLL: 26,
    ROTATION_PITCH: 27,

    ACCEL_STDDEV: 28,
    EEG_POWER_SUM: 29,
    STREAM_RESERVED6: 30,
    STREAM_RESERVED7: 31,
};

const STREAM_ID_MAX = 31;

const StreamIdsToNames = {
    [StreamIds.SIGNAL_QUALITY]: "signal",
    [StreamIds.RAW_EEG]: "eeg",
    [StreamIds.HEART_RATE]: "heart",
    [StreamIds.ACCEL_X]: "accel-x",

    [StreamIds.ACCEL_Y]: "accel-y",
    [StreamIds.ACCEL_Z]: "accel-z",
    [StreamIds.GYRO_X]: "gyro-x",
    [StreamIds.GYRO_Y]: "gyro-y",

    [StreamIds.GYRO_Z]: "gyro-z",
    [StreamIds.TEMPERATURE]: "temp",
    [StreamIds.BATTERY]: "batt",
    [StreamIds.STREAM_RESERVED1]: "rsvd1",

    [StreamIds.STREAM_RESERVED2]: "rsvd2",
    [StreamIds.STREAM_RESERVED3]: "rsvd3",
    [StreamIds.STREAM_RESERVED4]: "rsvd4",
    [StreamIds.STREAM_RESERVED5]: "rsvd5",

    [StreamIds.SLEEP_FEATURES]: "sf",
    [StreamIds.SLEEP_STAGES]: "ss",
    [StreamIds.SLEEP_TRACKER]: "st",
    [StreamIds.EEG_DELTA]: "eeg-delta",

    [StreamIds.EEG_THETA]: "eeg-theta",
    [StreamIds.EEG_ALPHA]: "eeg-alpha",
    [StreamIds.EEG_BETA]: "eeg-beta",
    [StreamIds.EEG_GAMMA]: "eeg-gamma",

    [StreamIds.ACCEL_MAGNITUDE]: "accel-mag",
    [StreamIds.GYRO_MAGNITUDE]: "gyro-mag",
    [StreamIds.ROTATION_ROLL]: "roll",
    [StreamIds.ROTATION_PITCH]: "pitch",

    [StreamIds.ACCEL_STDDEV]: "accel-sd",
    [StreamIds.EEG_POWER_SUM]: "eeg-powsum",
    //    [StreamIds.STREAM_RESERVED13]: "rsvd13",
    //   [StreamIds.STREAM_RESERVED14]: "rsvd14"
};

const StreamOutputIds = {
    SILENT: 0,
    FILE_CSV: 1,
    FILE_RAW: 2,
    CONSOLE: 3,
    DATA_LOG: 4,
    BLE: 5,
};

enum SleepStages {
    UNKNOWN = 0,
    AWAKE = 1,
    LIGHT = 2,
    DEEP = 3,
    REM = 4,
}

enum SleepStates {
    INIT = 0,
    CONFIGURING = 1,
    SLEEPING = 2,
    WAKING = 3,
    AWAKE = 4,
    SYNCING = 5,
    SYNCING_ERROR = 6,
}

const SleepStatesToNames = {
    [SleepStates.INIT]: "INIT",
    [SleepStates.CONFIGURING]: "CONFIGURING",
    [SleepStates.SLEEPING]: "SLEEPING",
    [SleepStates.WAKING]: "WAKING",
    [SleepStates.AWAKE]: "AWAKE",
    [SleepStates.SYNCING]: "SYNCING",
    [SleepStates.SYNCING_ERROR]: "SYNCING_ERROR",
};

enum ConnectionStates {
    IDLE = 0,
    INIT = 1,
    SCANNING = 2,
    CONNECTING = 3,
    CONNECTED = 4,
    BUSY = 5,
    DISCONNECTING = 6,
    DISCONNECTED = 7,
    RECONNECTING = 8,
}

const ConnectionStatesToNames = {
    [ConnectionStates.IDLE]: "IDLE",
    [ConnectionStates.INIT]: "INIT",
    [ConnectionStates.SCANNING]: "SCANNING",
    [ConnectionStates.CONNECTING]: "CONNECTING",
    [ConnectionStates.CONNECTED]: "CONNECTED",
    [ConnectionStates.BUSY]: "BUSY",
    [ConnectionStates.DISCONNECTING]: "DISCONNECTING",
    [ConnectionStates.DISCONNECTED]: "DISCONNECTED",
    [ConnectionStates.RECONNECTING]: "RECONNECTING",
};

const LogTypeIds = {
    DATA: 0,
    INFO: 1,
    EVENT: 2,
    WARNING: 3,
    ERROR: 4,
    DEBUG: 5,
};

const LogNamesToTypeIds = {
    DATA: LogTypeIds.DATA,
    INFO: LogTypeIds.INFO,
    EVNT: LogTypeIds.EVENT,
    WARN: LogTypeIds.WARNING,
    ERRO: LogTypeIds.ERROR,
    DBUG: LogTypeIds.DEBUG,
};

const BuzzerSongs = [
    { file: "arpeggio.buzz", title: "Arpeggio" },
    { file: "axels-theme.buzz", title: "Axels Theme" },
    { file: "bach-minuet.buzz", title: "Bach Minuet" },
    { file: "bach-prelude.buzz", title: "Bach Prelude" },
    { file: "chromatic-scale.buzz", title: "Chromatic Scale" },
    { file: "debussy-arabesque.buzz", title: "Debussy Arabesque" },
    { file: "freedom-jazz-dance.buzz", title: "Freedom Jazz Dance" },
    { file: "grandfather-clock.buzz", title: "Grandfather Clock" },
    { file: "la-cucaracha.buzz", title: "La Cucaracha" },
    { file: "mario-theme.buzz", title: "Mario Theme" },
    { file: "morning-mood.buzz", title: "Morning Mood" },
    { file: "pink-panther-theme.buzz", title: "Pink Panther Theme" },
    { file: "reveille.buzz", title: "Reveille" },
    { file: "simpsons-theme.buzz", title: "Simpsons Theme" },
    { file: "spain.buzz", title: "Spain" },
    { file: "whole-tone-scale.buzz", title: "Whole Tone Scale" },
    { file: "zelda-secret.buzz", title: "Zelda Secret" },
];

const LedColors = [
    { name: "white", value: "#FFFFFF" },
    { name: "red", value: "#FF0000" },
    { name: "orange", value: "#FFFF00" },
    { name: "pink", value: "#FF00FF" },
    { name: "cyan", value: "#00FFFF" },
    { name: "green", value: "#00FF00" },
    { name: "blue", value: "#0000FF" },
    { name: "yellow", value: "#FF7700" },
];

const LedEffects = [
    { name: "set", cmd: "led-set" },
    { name: "blink", cmd: "led-blink" },
    { name: "alternate", cmd: "led-alternate" },
    { name: "transition", cmd: "led-transition" },
];

enum DeviceEventList {
    connectionStateChange = "connectionStateChange",
    cmdInputRequested = "cmdInputRequested",
    cmdOutputReady = "cmdOutputReady",
    auroraEvent = "auroraEvent",
    streamData = "streamData",
    Error = "error",
}
export {
    AURORA_USB_VID,
    AURORA_USB_MSD_PID,
    AURORA_USB_SERIAL_PID,
    BLE_CMD_MAX_PACKET_LENGTH,
    BLE_CMD_MAX_PAYLOAD,
    BleAuroraChars,
    BleAuroraService,
    BleCmdStates,
    BuzzerSongs,
    ConnectorTypes,
    DataTypes,
    EventIds,
    EventIdsToNames,
    EventOutputIds,
    EVENT_ID_MAX,
    LedColors,
    LedEffects,
    LogTypeIds,
    LogNamesToTypeIds,
    LOW_BATTERY_THRESHOLD,
    MSD_DRIVE_NAME,
    StreamIds,
    StreamIdsToNames,
    StreamOutputIds,
    STREAM_ID_MAX,
    SleepStages,
    SleepStates,
    SleepStatesToNames,
    ConnectionStates,
    ConnectionStatesToNames,
    DeviceEventList,
    CommandNames,
};
