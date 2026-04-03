import "react-native";
import "@testing-library/jest-native/extend-expect";

// Silence warnings from React Native in test environment
const originalConsoleError = console.error;
console.error = (message, ...args) => {
    if (
        typeof message === "string" &&
        (message.startsWith("Warning:") ||
            message.includes("ReactDOM.render is no longer supported"))
    ) {
        return;
    }
    originalConsoleError(message, ...args);
};

const originalConsoleWarn = console.warn;
console.warn = (message, ...args) => {
    if (
        typeof message === "string" &&
        (message.includes("Animated:") || message.includes("AsyncStorage"))
    ) {
        return;
    }
    originalConsoleWarn(message, ...args);
};
