// Web stub for the native-only @react-native-community/datetimepicker.
// The real package ships Flow source and native modules; it cannot run in the
// browser (or be bundled by Vite's esbuild/rolldown).
import { makeHost } from "./rn/host";

export const DateTimePicker = makeHost("DateTimePicker");
export const DateTimePickerAndroid = { open: () => {}, dismiss: () => {} };
export const IOSMode = { time: "time", date: "date", datetime: "datetime", countdown: "countdown" };
export const AndroidMode = { date: "date", time: "time" };
export const AndroidDisplay = {
    default: "default",
    spinner: "spinner",
    clock: "clock",
    calendar: "calendar",
};

export default DateTimePicker;