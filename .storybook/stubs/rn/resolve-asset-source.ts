// Vite alias target for react-native/Libraries/Image/resolveAssetSource.
// Returns a neutral asset descriptor; story tests never need real images.
export default function resolveAssetSource(source: unknown) {
    return {
        uri: "",
        width: 0,
        height: 0,
        scale: 1,
        ...(typeof source === "object" && source ? source : {}),
    };
}
export { resolveAssetSource };
