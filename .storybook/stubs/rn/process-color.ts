// Vite alias target for react-native/Libraries/StyleSheet/processColor.
// Native module that maps color values; in the browser colors pass through
// unchanged (react-native-web handles them at the style layer).
export default function processColor(color: unknown): unknown {
    return color;
}
export { processColor };
