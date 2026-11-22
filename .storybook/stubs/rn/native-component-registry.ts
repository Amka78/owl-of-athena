// Vite alias target for react-native/Libraries/NativeComponent/NativeComponentRegistry.
import { makeHost } from "./host";

export const get = (name: string, _viewConfigProvider: any) => makeHost(name);
export const getWithDevWhiteList = (name: string, _viewConfigProvider: any) => makeHost(name);
export const register = (name: string, _viewConfigProvider: any) => makeHost(name);

export default { get, getWithDevWhiteList, register };