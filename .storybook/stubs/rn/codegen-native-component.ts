// Vite alias target for react-native/Libraries/Utilities/codegenNativeComponent.
// Native-boundary modules (safe-area-context, slider, ...) import this to
// register native components; in the browser there are none, so return a host
// component carrying the requested name.
import { makeHost } from "./host";

const codegenNativeComponent = (name: string) => makeHost(name);

export default codegenNativeComponent;
export { codegenNativeComponent };