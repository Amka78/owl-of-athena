// Vite alias target for react-native/Libraries/NativeComponent/NativeComponentRegistry
import React from "react";

function makeHost(name: string) {
    const C = (props: any) => React.createElement(name, props);
    C.displayName = name;
    return C;
}

export const get = (name: string, _viewConfigProvider: any) => makeHost(name);
export const getWithDevWhiteList = (name: string, _viewConfigProvider: any) =>
    makeHost(name);
export const register = (name: string, _viewConfigProvider: any) => makeHost(name);

export default { get, getWithDevWhiteList, register };