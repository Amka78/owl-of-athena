// Web stub for the umbrella "expo" package.
// The real entry bootstraps async-require/HMR which asserts a native
// `platform` and pulls node's "stream" into the browser. The expo-* packages
// only need the shared helpers below (CodedError/UnavailabilityError,
// requireNativeModule, Platform, hooks, ...).

export class CodedError extends Error {
    code: string;
    constructor(code: string, message: string) {
        super(message);
        this.code = code;
    }
}

export class UnavailabilityError extends CodedError {
    constructor(moduleName: string, propertyName: string) {
        super(
            "ERR_UNAVAILABLE",
            `The method or property ${moduleName}.${propertyName} is not available on this platform`,
        );
    }
}

export class NativeModule {}
export class SharedObject {}
export class SharedRef {}

// Native modules do not exist in the browser; return undefined so web build
// variants check for presence (mirrors real expo on web).
export const requireNativeModule = (_moduleName: string) => undefined;
export const requireOptionalNativeModule = (_moduleName: string) => undefined;
export const requireNativeViewManager = (_viewName: string) => undefined;

export const isRunningInExpoGo = () => false;
export const registerRootComponent = (component: any) => component;

export const Platform = {
    OS: "web",
    Version: 0,
    isNative: false,
    isDOMAvailable: true,
    isTV: false,
    select: <T extends Record<string, unknown>>(specifics: T): unknown =>
        specifics.web ?? specifics.default,
};

export const PermissionStatus = {
    GRANTED: "granted",
    UNDETERMINED: "undetermined",
    DENIED: "denied",
};

export const useEvent = () => undefined;
export const useReleasingSharedObject = () => undefined;
export const useReleasingSharedObjectWithLifecycle = () => undefined;

export default { CodedError, UnavailabilityError, Platform };
