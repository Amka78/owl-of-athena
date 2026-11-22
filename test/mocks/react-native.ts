// Mock module for `react-native` under vitest.
//
// This file is wired up via a Vite alias in vitest.config.ts (see
// resolve.alias). Unlike `vi.mock`, an alias also intercepts imports issued
// from inside node_modules packages (e.g. @testing-library/react-native's
// internal `require("react-native")`), which is required because the real
// react-native source ships Flow syntax that Vite's transform cannot parse.
//
// Host components are created via makeHost() so their rendered elements have
// a string `type` and @testing-library/react-native can detect them as host
// components (`typeof node.type === "string"`).
import React from "react";

function makeHost(name: string) {
    const C = (props: any) => React.createElement(name, props);
    C.displayName = name;
    return C;
}

class AnimatedValue {
    _v: number;
    constructor(v: number) {
        this._v = v;
    }
    setValue(v: number) {
        this._v = v;
    }
    setOffset(_v: number) {}
    flattenOffset() {}
    extractOffset() {}
    addListener(_cb: any) {
        return "";
    }
    removeListener(_id: string) {}
    removeAllListeners() {}
    stopAnimation(_cb?: any) {}
    resetAnimation(_cb?: any) {}
    interpolate(_cfg: any) {
        return this;
    }
    animate(_animation: any, _cb: any) {}
}

const animation = () => ({
    start: (cb?: (result: { finished: boolean }) => void) => {
        cb?.({ finished: true });
    },
    stop: () => {},
    reset: () => {},
});

const mocks = {
    // Core
    Platform: {
        OS: "ios",
        select: (obj: any) => obj.ios ?? obj.native ?? obj.default ?? undefined,
        Version: 14,
        isTesting: true,
        isPad: false,
        isTV: false,
    },
    TurboModuleRegistry: {
        get: (_name: string) => null,
        getEnforcing: (_name: string) => ({}),
    },
    StyleSheet: {
        create: (s: any) => s,
        flatten: (s: any) => (Array.isArray(s) ? Object.assign({}, ...s) : s),
        hairlineWidth: 1,
        absoluteFill: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
        absoluteFillObject: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
        compose: (a: any, b: any) => [a, b],
    },
    // Host components
    View: makeHost("View"),
    Text: makeHost("Text"),
    TextInput: makeHost("TextInput"),
    Image: makeHost("Image"),
    ScrollView: makeHost("ScrollView"),
    FlatList: makeHost("FlatList"),
    SectionList: makeHost("SectionList"),
    VirtualizedList: makeHost("VirtualizedList"),
    // Touchable/pressable components: always accessible=true by default
    // so that @testing-library/react-native getByRole() can find them.
    // Pressable also supports render-prop children (function(state) => element).
    TouchableOpacity: (props: any) =>
        React.createElement("TouchableOpacity", { accessible: true, ...props }),
    TouchableHighlight: (props: any) =>
        React.createElement("TouchableHighlight", { accessible: true, ...props }),
    TouchableNativeFeedback: (props: any) =>
        React.createElement("TouchableNativeFeedback", { accessible: true, ...props }),
    TouchableWithoutFeedback: (props: any) =>
        React.createElement("TouchableWithoutFeedback", { accessible: true, ...props }),
    Pressable: ({ children, ...rest }: any) => {
        const resolved =
            typeof children === "function"
                ? children({ pressed: false, hovered: false, focused: false })
                : children;
        return React.createElement("Pressable", {
            accessible: true,
            ...rest,
            children: resolved,
        });
    },
    Modal: makeHost("Modal"),
    Switch: makeHost("Switch"),
    ActivityIndicator: makeHost("ActivityIndicator"),
    KeyboardAvoidingView: makeHost("KeyboardAvoidingView"),
    SafeAreaView: makeHost("SafeAreaView"),
    StatusBar: makeHost("StatusBar"),
    DrawerLayoutAndroid: makeHost("DrawerLayoutAndroid"),
    RefreshControl: makeHost("RefreshControl"),
    // react-native-svg's SvgTouchableMixin accesses Touchable.Mixin at import time
    Touchable: { Mixin: {} },
    // Animated
    Easing: {
        linear: (t: number) => t,
        ease: (t: number) => t,
        quad: (t: number) => t,
        cubic: (t: number) => t,
        poly: (_n: number) => (t: number) => t,
        sin: (t: number) => t,
        circle: (t: number) => t,
        exp: (t: number) => t,
        elastic: (_b?: number) => (t: number) => t,
        back: (_s?: number) => (t: number) => t,
        bounce: (t: number) => t,
        bezier: (_x1: number, _y1: number, _x2: number, _y2: number) =>
            (t: number) => t,
        in: (f: any) => f,
        out: (f: any) => f,
        inOut: (f: any) => f,
        step0: (n: number) => (n > 0 ? 1 : 0),
        step1: (n: number) => (n >= 1 ? 1 : 0),
    },
    Animated: {
        View: makeHost("Animated.View"),
        // Use "Text" so @testing-library/react-native's isHostText() recognises it.
        Text: makeHost("Text"),
        Image: makeHost("Animated.Image"),
        ScrollView: makeHost("Animated.ScrollView"),
        FlatList: makeHost("Animated.FlatList"),
        createAnimatedComponent: (C: any) => C,
        Value: AnimatedValue,
        ValueXY: class AnimatedValueXY {
            x: AnimatedValue;
            y: AnimatedValue;
            constructor(value?: { x: number; y: number }) {
                this.x = new AnimatedValue(value?.x ?? 0);
                this.y = new AnimatedValue(value?.y ?? 0);
            }
            setValue(v: { x: number; y: number }) {
                this.x.setValue(v.x);
                this.y.setValue(v.y);
            }
            getLayout() {
                return {};
            }
            getTranslateTransform() {
                return [];
            }
            addListener(_cb: any) {
                return "";
            }
            removeListener(_id: string) {}
            removeAllListeners() {}
            stopAnimation() {}
            resetAnimation() {}
        },
        timing: animation,
        spring: animation,
        decay: animation,
        sequence: (_anims: any[]) => animation(),
        parallel: (_anims: any[], _cfg?: any) => animation(),
        stagger: (_ms: number, _anims: any[]) => animation(),
        loop: (_anim: any, _cfg?: any) => ({
            start: () => {},
            stop: () => {},
            reset: () => {},
        }),
        delay: (_ms: number) => animation(),
        event: (_mapping: any[], _cfg?: any) => () => {},
        add: (a: any, _b: any) => a,
        subtract: (a: any, _b: any) => a,
        multiply: (a: any, _b: any) => a,
        divide: (a: any, _b: any) => a,
        modulo: (a: any, _b: any) => a,
        diffClamp: (v: any, _min: number, _max: number) => v,
    },
    // Utilities
    Dimensions: {
        get: (_dim: string) => ({ width: 375, height: 812, scale: 2, fontScale: 1 }),
        addEventListener: (_event: string, _handler: any) => ({
            remove: () => {},
        }),
        removeEventListener: () => {},
        set: () => {},
    },
    I18nManager: {
        isRTL: false,
        allowRTL: () => {},
        forceRTL: () => {},
        swapLeftAndRightInRTL: () => {},
        getConstants: () => ({ isRTL: false, doLeftAndRightSwapInRTL: true }),
    },
    Keyboard: {
        addListener: (_event: string, _handler: any) => ({
            remove: () => {},
        }),
        removeListener: () => {},
        removeAllListeners: () => {},
        dismiss: () => {},
        scheduleLayoutAnimation: () => {},
    },
    BackHandler: {
        addEventListener: (_event: string, _handler: any) => ({
            remove: () => {},
        }),
        removeEventListener: () => {},
        exitApp: () => {},
    },
    AppState: {
        currentState: "active",
        addEventListener: (_event: string, _handler: any) => ({
            remove: () => {},
        }),
        removeEventListener: () => {},
    },
    Alert: { alert: () => {}, prompt: () => {} },
    Linking: {
        openURL: () => Promise.resolve(),
        canOpenURL: () => Promise.resolve(true),
        getInitialURL: () => Promise.resolve(null),
        addEventListener: (_event: string, _handler: any) => ({
            remove: () => {},
        }),
        removeEventListener: () => {},
        sendIntent: () => Promise.resolve(),
        openSettings: () => Promise.resolve(),
    },
    NativeModules: {},
    NativeEventEmitter: class NativeEventEmitter {
        constructor(_nativeModule?: any) {}
        addListener(_event: string, _listener: (...args: any[]) => void) {
            return { remove: () => {} };
        }
        removeAllListeners(_event?: string) {}
        emit(_event: string, ..._args: any[]) {}
    },
    DeviceEventEmitter: {
        addListener: (_event: string, _handler: any) => ({
            remove: () => {},
        }),
        removeAllListeners: () => {},
        emit: () => {},
    },
    AccessibilityInfo: {
        addEventListener: (_event: string, _handler: any) => ({
            remove: () => {},
        }),
        fetch: () => Promise.resolve(false),
        isAccessibilityServiceEnabled: () => Promise.resolve(false),
        isColorInversionEnabled: () => Promise.resolve(false),
        isGrayscaleEnabled: () => Promise.resolve(false),
        isReduceMotionEnabled: () => Promise.resolve(false),
        isReduceTransparencyEnabled: () => Promise.resolve(false),
        isScreenReaderEnabled: () => Promise.resolve(false),
        setAccessibilityFocus: () => {},
        announceForAccessibility: () => {},
    },
    InteractionManager: {
        runAfterInteractions: (task: any) => {
            if (typeof task === "function") task();
            return {
                then: (f: any) => {
                    f();
                    return { done: (f2: any) => f2?.() };
                },
                cancel: () => {},
            };
        },
        createInteractionHandle: () => 1,
        clearInteractionHandle: () => {},
    },
    PixelRatio: {
        get: () => 2,
        getFontScale: () => 1,
        getPixelSizeForLayoutSize: (s: number) => s * 2,
        roundToNearestPixel: (s: number) => Math.round(s * 2) / 2,
    },
    PanResponder: {
        create: () => ({ panHandlers: {} }),
    },
    Vibration: { vibrate: () => {}, cancel: () => {} },
    Share: {
        share: () => Promise.resolve({ action: "sharedAction" }),
    },
    Clipboard: {
        getString: () => Promise.resolve(""),
        setString: () => {},
    },
    findNodeHandle: () => null,
    UIManager: {
        measure: () => {},
        measureInWindow: () => {},
        measureLayout: () => {},
        hasViewManagerConfig: () => false,
        getViewManagerConfig: () => ({}),
        dispatchViewManagerCommand: () => {},
    },
    requireNativeComponent: (name: string) => makeHost(name),
    processColor: (color: any) => color,
    useWindowDimensions: () => ({
        width: 375,
        height: 812,
        scale: 2,
        fontScale: 1,
    }),
    useColorScheme: () => null,
    ColorPropType: {},
    // Appearance API
    Appearance: {
        getColorScheme: () => null,
        addChangeListener: (_handler: any) => ({ remove: () => {} }),
        removeChangeListener: () => {},
    },
    LogBox: { ignoreLogs: () => {}, ignoreAllLogs: () => {} },
} as const;

export const Platform = mocks.Platform;
export const TurboModuleRegistry = mocks.TurboModuleRegistry;
export const StyleSheet = mocks.StyleSheet;
export const View = mocks.View;
export const Text = mocks.Text;
export const TextInput = mocks.TextInput;
export const Image = mocks.Image;
export const ScrollView = mocks.ScrollView;
export const FlatList = mocks.FlatList;
export const SectionList = mocks.SectionList;
export const VirtualizedList = mocks.VirtualizedList;
export const TouchableOpacity = mocks.TouchableOpacity;
export const TouchableHighlight = mocks.TouchableHighlight;
export const TouchableNativeFeedback = mocks.TouchableNativeFeedback;
export const TouchableWithoutFeedback = mocks.TouchableWithoutFeedback;
export const Pressable = mocks.Pressable;
export const Modal = mocks.Modal;
export const Switch = mocks.Switch;
export const ActivityIndicator = mocks.ActivityIndicator;
export const KeyboardAvoidingView = mocks.KeyboardAvoidingView;
export const SafeAreaView = mocks.SafeAreaView;
export const StatusBar = mocks.StatusBar;
export const DrawerLayoutAndroid = mocks.DrawerLayoutAndroid;
export const RefreshControl = mocks.RefreshControl;
export const Touchable = mocks.Touchable;
export const Easing = mocks.Easing;
export const Animated = mocks.Animated;
export const Dimensions = mocks.Dimensions;
export const I18nManager = mocks.I18nManager;
export const Keyboard = mocks.Keyboard;
export const BackHandler = mocks.BackHandler;
export const AppState = mocks.AppState;
export const Alert = mocks.Alert;
export const Linking = mocks.Linking;
export const NativeModules = mocks.NativeModules;
export const NativeEventEmitter = mocks.NativeEventEmitter;
export const DeviceEventEmitter = mocks.DeviceEventEmitter;
export const AccessibilityInfo = mocks.AccessibilityInfo;
export const InteractionManager = mocks.InteractionManager;
export const PixelRatio = mocks.PixelRatio;
export const PanResponder = mocks.PanResponder;
export const Vibration = mocks.Vibration;
export const Share = mocks.Share;
export const Clipboard = mocks.Clipboard;
export const findNodeHandle = mocks.findNodeHandle;
export const UIManager = mocks.UIManager;
export const requireNativeComponent = mocks.requireNativeComponent;
export const processColor = mocks.processColor;
export const useWindowDimensions = mocks.useWindowDimensions;
export const useColorScheme = mocks.useColorScheme;
export const ColorPropType = mocks.ColorPropType;
export const Appearance = mocks.Appearance;
export const LogBox = mocks.LogBox;

export default mocks;