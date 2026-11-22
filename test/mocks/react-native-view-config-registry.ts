// Vite alias target for react-native/Libraries/Renderer/shims/ReactNativeViewConfigRegistry

export const customBubblingEventTypes: Record<string, unknown> = {};
export const customDirectEventTypes: Record<string, unknown> = {};
export const get = (_name: string) => ({});
export const register = (_name: string, _cfg: any) => ({});
export const registerLazy = (_name: string, _cfg: any) => {};

export default { customBubblingEventTypes, customDirectEventTypes, get, register, registerLazy };