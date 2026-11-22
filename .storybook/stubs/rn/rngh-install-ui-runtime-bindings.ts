// Vite alias target for react-native-gesture-handler の
// handlers/gestures/installUIRuntimeBindings。
// v3 Gesture API がネイティブブリッジ (RNGestureHandlerModule / worklets) を
// 要求する箇所を story レンダー用に noop 化する。
export function installUIRuntimeBindings(_getUIRuntimeHolder?: () => unknown) {
    return null;
}
export default installUIRuntimeBindings;
