// Vite alias target for the bare "react-native" specifier in the storybook
// browser tests: re-export react-native-web and fill in the native-boundary
// APIs that RN deps import from "react-native" but that react-native-web does
// not provide (codegenNativeComponent / TurboModuleRegistry).
export * from "react-native-web";
// 同一 export 節に同名を 2 回並べると SyntaxError になるため、1 回だけ
export { default as codegenNativeComponent } from "./codegen-native-component";

// react-native-codegen: builds the typed command object from the factory.
export const codegenNativeCommands = <Commands extends object>(factory: () => Commands): Commands =>
    factory();

export const TurboModuleRegistry = {
    get: () => null,
    getEnforcing: () => ({}),
    getByName: () => null,
};
