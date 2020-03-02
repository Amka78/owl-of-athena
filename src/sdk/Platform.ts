import { Platform } from "react-native";

const isDesktop = Platform.OS === "windows" || Platform.OS === "macos";

export { isDesktop };
