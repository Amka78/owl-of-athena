import { DefaultTheme } from "react-native-paper";
import { Colors } from "../constants";

export const Theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: Colors.teal,
        accent: Colors.cyan,
        background: Colors.navy,
        error: Colors.red,
        text: Colors.white,
        placeholder: Colors.white,
    },
};
export type ThemeType = Partial<ReactNativePaper.Theme>;
