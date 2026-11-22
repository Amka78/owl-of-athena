// Vite alias target for react-native-gesture-handler/lib/module/v3/NativeProxy
// (relative-imported from handlers/gestures/installUIRuntimeBindings).
// ネイティブブリッジ (RNGestureHandlerModule) 依存を story レンダー用に noop 化。
export const NativeProxy = {
    createGestureHandler: () => {},
    setGestureHandlerConfig: () => {},
    updateGestureHandlerConfig: () => {},
    dropGestureHandler: () => {},
    configureRelations: () => {},
    installUIRuntimeBindings: () => null,
    attachGestureHandler: () => {},
    updateHandlers: () => {},
    flushOperations: () => {},
    synchronizeData: () => {},
    getGestureHandlerState: () => 0,
};

export default NativeProxy;
