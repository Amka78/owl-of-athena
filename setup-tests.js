import { afterEach } from "bun:test";
import { Message } from "./src/constants";

// Reset locale to en-US after each test to prevent locale state bleeding between tests
afterEach(() => {
    Message.setLocale("en-US");
});

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
