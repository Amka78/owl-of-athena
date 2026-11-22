// Vite alias target for
// react-native/Libraries/ReactNative/ReactFabricPublicInstance/ReactFabricPublicInstance.
// Fabric-only bridge used by gesture-handler; not meaningful in the browser.

export function getInternalInstanceHandleFromPublicInstance(_instance: unknown) {
    return null;
}
export default { getInternalInstanceHandleFromPublicInstance };
