// Vite alias target for react-native/Libraries/NativeComponent/ViewConfigIgnore.

// Codegen'd native component files (e.g. @react-native-community/slider) call
// this to lift the native-only handlers out of validAttributes; a passthrough
// keeps the view config intact.
export const ConditionallyIgnoredEventHandlers = (attrs: any) => attrs;

export default ConditionallyIgnoredEventHandlers;
