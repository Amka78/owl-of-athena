// Vite alias target for react-native/Libraries/Utilities/codegenNativeComponent
import React from "react";

function makeHost(name: string) {
    const C = (props: any) => React.createElement(name, props);
    C.displayName = name;
    return C;
}

const codegenNativeComponent = (name: string) => makeHost(name);

export default codegenNativeComponent;
export { codegenNativeComponent };