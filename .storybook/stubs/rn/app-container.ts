// Vite alias target for react-native/Libraries/ReactNative/AppContainer.
import React from "react";

export const AppContainer = ({ children }: any) =>
    React.createElement(React.Fragment, null, children);
export default AppContainer;
