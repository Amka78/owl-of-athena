/**
 * Preload script for bun test: mocks react-native and related packages
 * that use Flow type syntax Bun cannot parse.
 *
 * This file is listed in bunfig.toml [test].preload and runs before every
 * test file.  mock.module() calls placed here prevent Bun from ever touching
 * the real (unparseable) source files.
 */
import { mock } from "bun:test";
import React from "react";

// ---------------------------------------------------------------------------
// Globals expected by React Native / Expo at module init time
// ---------------------------------------------------------------------------
globalThis.__DEV__ = true;
process.env.EXPO_OS = process.env.EXPO_OS ?? "ios";

// expo-modules-core reads globalThis.expo.EventEmitter
class _EventEmitter {
    addListener(_event: string, _listener: (...args: any[]) => void) {
        return { remove: () => {} };
    }
    removeAllListeners(_event?: string) {}
    emit(_event: string, ..._args: any[]) {}
}
(globalThis as any).expo ??= { EventEmitter: _EventEmitter, modules: {} };
(globalThis as any).expo.EventEmitter ??= _EventEmitter;
(globalThis as any).expo.modules ??= {};

// ---------------------------------------------------------------------------
// Helper: create a host component (string-typed) so @testing-library/react-native
// can detect it via `typeof node.type === 'string'`.
// ---------------------------------------------------------------------------
function makeHost(name: string) {
    const C = (props: any) => React.createElement(name, props);
    C.displayName = name;
    return C;
}

// ---------------------------------------------------------------------------
// react-native
// ---------------------------------------------------------------------------
mock.module("react-native", () => {
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

    return {
        // Core
        Platform: {
            OS: "ios",
            select: (obj: any) =>
                obj.ios ?? obj.native ?? obj.default ?? undefined,
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
            flatten: (s: any) =>
                Array.isArray(s) ? Object.assign({}, ...s) : s,
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
        NativeEventEmitter: class NativeEventEmitter extends _EventEmitter {
            constructor(_nativeModule?: any) {
                super();
            }
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
    };
});

// ---------------------------------------------------------------------------
// react-native subpath: codegenNativeComponent
// ---------------------------------------------------------------------------
mock.module("react-native/Libraries/Utilities/codegenNativeComponent", () => ({
    default: (name: string) => makeHost(name),
}));

// ---------------------------------------------------------------------------
// react-native subpath: NativeComponentRegistry (used by slider, etc.)
// ---------------------------------------------------------------------------
mock.module("react-native/Libraries/NativeComponent/NativeComponentRegistry", () => ({
    get: (name: string, _viewConfigProvider: any) => makeHost(name),
    getWithDevWhiteList: (name: string, _viewConfigProvider: any) => makeHost(name),
    register: (name: string, _viewConfigProvider: any) => makeHost(name),
}));

// ---------------------------------------------------------------------------
// react-native subpath: ReactNativeViewConfigRegistry (used by gesture handler)
// ---------------------------------------------------------------------------
mock.module(
    "react-native/Libraries/Renderer/shims/ReactNativeViewConfigRegistry",
    () => ({
        customBubblingEventTypes: {},
        customDirectEventTypes: {},
        get: (_name: string) => ({}),
        register: (_name: string, _cfg: any) => ({}),
        registerLazy: (_name: string, _cfg: any) => {},
    })
);
// ---------------------------------------------------------------------------
mock.module("react-native-safe-area-context", () => {
    const SafeAreaProvider = ({ children }: any) =>
        React.createElement(React.Fragment, null, children);
    const SafeAreaView = makeHost("SafeAreaView");
    const useSafeAreaInsets = () => ({ top: 0, right: 0, bottom: 0, left: 0 });
    const useSafeAreaFrame = () => ({
        x: 0,
        y: 0,
        width: 375,
        height: 812,
    });
    const SafeAreaInsetsContext = React.createContext({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    });
    return {
        SafeAreaProvider,
        SafeAreaView,
        SafeAreaConsumer: SafeAreaInsetsContext.Consumer,
        SafeAreaInsetsContext,
        useSafeAreaInsets,
        useSafeAreaFrame,
        initialWindowMetrics: {
            insets: { top: 0, right: 0, bottom: 0, left: 0 },
            frame: { x: 0, y: 0, width: 375, height: 812 },
        },
    };
});

// ---------------------------------------------------------------------------
// @expo/vector-icons
// ---------------------------------------------------------------------------
mock.module("@expo/vector-icons", () => {
    const Icon = makeHost("Icon");
    return {
        MaterialCommunityIcons: Icon,
        MaterialIcons: Icon,
        Ionicons: Icon,
        FontAwesome: Icon,
        FontAwesome5: Icon,
        AntDesign: Icon,
        Entypo: Icon,
        EvilIcons: Icon,
        Feather: Icon,
        Foundation: Icon,
        Octicons: Icon,
        SimpleLineIcons: Icon,
        Zocial: Icon,
        createIconSet: () => Icon,
        createIconSetFromFontello: () => Icon,
        createIconSetFromIcoMoon: () => Icon,
    };
});

// ---------------------------------------------------------------------------
// expo-constants  (needs globalThis.expo already set above)
// ---------------------------------------------------------------------------
mock.module("expo-constants", () => {
    const Constants = {
        expoConfig: {
            name: "owl-of-athena",
            slug: "owl-of-athena",
            extra: { channel: undefined as string | undefined },
        },
        manifest: null,
        manifest2: null,
        appOwnership: null,
        executionEnvironment: "storeClient",
        isDevice: false,
        sessionId: "test-session-id",
        systemVersion: "14.0",
        systemFonts: [],
        statusBarHeight: 20,
        deviceName: "iPhone",
        platform: { ios: { buildNumber: "1" } },
    };
    return { default: Constants, ...Constants };
});

// ---------------------------------------------------------------------------
// expo-modules-core  is NOT mocked - it loads fine once globalThis.expo is
// set up above and react-native is mocked. If specific native modules are
// needed, they are provided via globalThis.expo.modules below.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// expo-keep-awake  (used in WakeLockService.native.ts; no direct test imports)
// ---------------------------------------------------------------------------
mock.module("expo-keep-awake", () => ({
    activateKeepAwakeAsync: () => Promise.resolve(),
    deactivateKeepAwake: () => Promise.resolve(),
    useKeepAwake: () => {},
}));

// ---------------------------------------------------------------------------
// expo-updates  (used in useAppUpdate.native.ts; no direct test imports)
// ---------------------------------------------------------------------------
mock.module("expo-updates", () => ({
    checkForUpdateAsync: () => Promise.resolve({ isAvailable: false }),
    fetchUpdateAsync: () => Promise.resolve({ isNew: false }),
    reloadAsync: () => Promise.resolve(),
    useUpdates: () => ({ isUpdateAvailable: false, isUpdatePending: false }),
    UpdateEventType: { ERROR: "error", NO_UPDATE_AVAILABLE: "noUpdateAvailable", UPDATE_AVAILABLE: "updateAvailable" },
}));

// ---------------------------------------------------------------------------
// react-native subpath: ReactNativeViewConfigRegistry (used by gesture handler)
// ---------------------------------------------------------------------------
mock.module(
    "react-native/Libraries/Renderer/shims/ReactNativeViewConfigRegistry",
    () => ({
        customBubblingEventTypes: {},
        customDirectEventTypes: {},
        get: (_name: string) => ({}),
        register: (_name: string, _cfg: any) => ({}),
        registerLazy: (_name: string, _cfg: any) => {},
    })
);

// ---------------------------------------------------------------------------
// @react-native-community/picker  (used by FieldLedEffect, SessionListMenu)
// ---------------------------------------------------------------------------
mock.module("@react-native-community/picker", () => {
    const PickerItem = makeHost("Picker.Item");
    const Picker = Object.assign(makeHost("Picker"), { Item: PickerItem });
    return { Picker, PickerIOS: Picker };
});

// ---------------------------------------------------------------------------
// @react-native-community/slider  (used by FieldSlider)
// ---------------------------------------------------------------------------
mock.module("@react-native-community/slider", () => {
    const Slider = makeHost("Slider");
    return { default: Slider, Slider };
});

// ---------------------------------------------------------------------------
// react-native-gesture-handler  (used by ScrollableList via ScrollView import)
// ---------------------------------------------------------------------------
mock.module("react-native-gesture-handler", () => {
    const mkPressable = (name: string) => ({ children, ...rest }: any) => {
        const resolved =
            typeof children === "function"
                ? children({ pressed: false })
                : children;
        return React.createElement(name, {
            accessible: true,
            ...rest,
            children: resolved,
        });
    };
    return {
        ScrollView: makeHost("ScrollView"),
        FlatList: makeHost("FlatList"),
        SectionList: makeHost("SectionList"),
        TouchableOpacity: mkPressable("TouchableOpacity"),
        TouchableHighlight: mkPressable("TouchableHighlight"),
        TouchableNativeFeedback: mkPressable("TouchableNativeFeedback"),
        TouchableWithoutFeedback: mkPressable("TouchableWithoutFeedback"),
        Pressable: mkPressable("Pressable"),
        PanGestureHandler: makeHost("PanGestureHandler"),
        TapGestureHandler: makeHost("TapGestureHandler"),
        LongPressGestureHandler: makeHost("LongPressGestureHandler"),
        PinchGestureHandler: makeHost("PinchGestureHandler"),
        RotationGestureHandler: makeHost("RotationGestureHandler"),
        FlingGestureHandler: makeHost("FlingGestureHandler"),
        NativeViewGestureHandler: makeHost("NativeViewGestureHandler"),
        RawButton: makeHost("RawButton"),
        BaseButton: makeHost("BaseButton"),
        RectButton: makeHost("RectButton"),
        BorderlessButton: makeHost("BorderlessButton"),
        GestureHandlerRootView: makeHost("GestureHandlerRootView"),
        Gesture: {
            Tap: () => ({ onBegin: () => ({}) }),
            Pan: () => ({ onUpdate: () => ({}) }),
            Pinch: () => ({}),
            Rotation: () => ({}),
            Fling: () => ({}),
            LongPress: () => ({}),
            Race: (..._gestures: any[]) => ({}),
            Simultaneous: (..._gestures: any[]) => ({}),
            Exclusive: (..._gestures: any[]) => ({}),
        },
        GestureDetector: makeHost("GestureDetector"),
        State: {
            UNDETERMINED: 0,
            FAILED: 1,
            BEGAN: 2,
            CANCELLED: 3,
            ACTIVE: 4,
            END: 5,
        },
        Directions: { RIGHT: 1, LEFT: 2, UP: 4, DOWN: 8 },
    };
});

// ---------------------------------------------------------------------------
// @react-native-community/datetimepicker  (used by DatePicker molecule)
// ---------------------------------------------------------------------------
mock.module("@react-native-community/datetimepicker", () => ({
    default: makeHost("DateTimePicker"),
    DateTimePickerAndroid: {
        open: () => {},
        dismiss: () => {},
    },
    IOSMode: { time: "time", date: "date", datetime: "datetime", countdown: "countdown" },
    AndroidMode: { date: "date", time: "time" },
    AndroidDisplay: { default: "default", spinner: "spinner", clock: "clock", calendar: "calendar" },
}));

// ---------------------------------------------------------------------------
// expo-localization  (loads fine but keep for completeness)
// ---------------------------------------------------------------------------
// expo-localization loads without mocking (it is pure JS); no mock needed.

// ---------------------------------------------------------------------------
// expo-av  (requires native 'ExponentAV' module unavailable in test env)
// ---------------------------------------------------------------------------
mock.module("expo-av", () => {
    const mockSound = {
        getStatusAsync: () => Promise.resolve({ isLoaded: false }),
        stopAsync: () => Promise.resolve(undefined),
        playAsync: () => Promise.resolve(undefined),
        unloadAsync: () => Promise.resolve(undefined),
        loadAsync: () => Promise.resolve(undefined),
    };
    return {
        Audio: {
            Sound: Object.assign(
                function () { return mockSound; },
                { createAsync: () => Promise.resolve({ sound: mockSound, status: {} }) }
            ),
            setAudioModeAsync: () => Promise.resolve(undefined),
        },
        Video: makeHost("Video"),
    };
});

// ---------------------------------------------------------------------------
// noble  (Bluetooth LE library; requires native bindings)
// ---------------------------------------------------------------------------
mock.module("noble", () => {
    const { EventEmitter } = require("events") as typeof import("events");
    class Noble extends EventEmitter {
        startScanning() {}
        stopScanning() {}
    }
    const noble = new Noble();
    return { default: noble, ...noble };
});

// ---------------------------------------------------------------------------
// serialport  (requires native bindings)
// ---------------------------------------------------------------------------
mock.module("serialport", () => {
    const { EventEmitter } = require("events") as typeof import("events");
    class SerialPort extends EventEmitter {
        constructor() { super(); }
        open(cb?: (err: null) => void) { cb?.(null); }
        close(cb?: (err: null) => void) { cb?.(null); }
        write(_data: any, cb?: (err: null) => void) { cb?.(null); }
        read() { return null; }
        pipe() { return this; }
    }
    (SerialPort as any).list = () => Promise.resolve([]);
    return { default: SerialPort, SerialPort };
});

// ---------------------------------------------------------------------------
// document global stub  (needed by d3 and similar DOM-based libs)
// ---------------------------------------------------------------------------
if (typeof document === "undefined") {
    const makeEl = (tag: string): any => ({
        tagName: tag,
        style: {},
        namespaceURI: "http://www.w3.org/2000/svg",
        ownerDocument: (globalThis as any).document,
        setAttribute(_k: string, _v: string) {},
        getAttribute(_k: string) { return null; },
        appendChild(child: any) { return child; },
        addEventListener(_e: string, _fn: any) {},
        removeEventListener(_e: string, _fn: any) {},
        dispatchEvent() { return true; },
        createElementNS(_ns: string, t: string) { return makeEl(t); },
        querySelectorAll() { return []; },
        querySelector() { return null; },
    });
    const doc: any = {
        createElement: (tag: string) => makeEl(tag),
        createElementNS: (_ns: string, tag: string) => makeEl(tag),
        documentElement: {
            namespaceURI: "http://www.w3.org/1999/xhtml",
            style: {},
        },
        querySelector: () => null,
        querySelectorAll: () => [],
        createTextNode: (text: string) => ({ data: text }),
        body: makeEl("body"),
    };
    // back-reference so ownerDocument resolves
    makeEl("_").ownerDocument = doc;
    (globalThis as any).document = doc;
}

// ---------------------------------------------------------------------------
// react-native-svg  (uses Touchable.Mixin and DOM APIs not available in bun)
// ---------------------------------------------------------------------------
const _svgHost = (name: string) => makeHost(name);
mock.module("react-native-svg", () => ({
    default: _svgHost("Svg"),
    Svg: _svgHost("Svg"),
    Circle: _svgHost("Circle"),
    Ellipse: _svgHost("Ellipse"),
    G: _svgHost("G"),
    Text: _svgHost("SvgText"),
    TSpan: _svgHost("TSpan"),
    TextPath: _svgHost("TextPath"),
    Path: _svgHost("Path"),
    Polygon: _svgHost("Polygon"),
    Polyline: _svgHost("Polyline"),
    Line: _svgHost("Line"),
    Rect: _svgHost("Rect"),
    Use: _svgHost("Use"),
    Image: _svgHost("SvgImage"),
    Symbol: _svgHost("Symbol"),
    Defs: _svgHost("Defs"),
    LinearGradient: _svgHost("LinearGradient"),
    RadialGradient: _svgHost("RadialGradient"),
    Stop: _svgHost("Stop"),
    ClipPath: _svgHost("ClipPath"),
    Pattern: _svgHost("Pattern"),
    Mask: _svgHost("Mask"),
    ForeignObject: _svgHost("ForeignObject"),
}));

// ---------------------------------------------------------------------------
// @react-navigation/*  (needs NavigationContainer in real app; mock for tests)
// ---------------------------------------------------------------------------
const _navFn = () => {};
const _navContext = () => ({ navigate: _navFn, goBack: _navFn, dispatch: _navFn, reset: _navFn, setParams: _navFn, setOptions: _navFn, isFocused: () => true, canGoBack: () => false, getParent: () => undefined, getState: () => ({}) });

const _mockTheme = { dark: false, colors: { primary: "#000", background: "#fff", card: "#fff", text: "#000", border: "#ccc", notification: "#f00" } };
const _mockContext = { Provider: ({ children }: any) => children, Consumer: () => null, displayName: "MockContext" } as any;

mock.module("@react-navigation/native", () => ({
    // hooks
    useNavigation: _navContext,
    useRoute: () => ({ key: "mock", name: "mock", params: {} }),
    useFocusEffect: (_cb: any) => {},
    useIsFocused: () => true,
    useTheme: () => _mockTheme,
    useLocale: () => ({ direction: "ltr", locales: [] }),
    useLinkBuilder: () => ({ buildHref: _navFn, buildAction: _navFn }),
    useLinkProps: () => ({ href: "#", accessibilityRole: "link", onPress: _navFn }),
    useLinkTo: () => _navFn,
    useRoutePath: () => "/",
    useScrollToTop: (_ref: any) => {},
    useNavigationContainerRef: () => ({ current: null }),
    useNavigationBuilder: () => ({}),
    useNavigationIndependentTree: () => {},
    useNavigationState: (_sel: any) => undefined,
    usePreventRemove: (_bool: any, _cb: any) => {},
    usePreventRemoveContext: () => ({}),
    useStateForPath: () => undefined,
    // components / containers
    NavigationContainer: ({ children }: any) => children,
    BaseNavigationContainer: ({ children }: any) => children,
    NavigationProvider: ({ children }: any) => children,
    NavigationIndependentTree: ({ children }: any) => children,
    PreventRemoveProvider: ({ children }: any) => children,
    ServerContainer: ({ children }: any) => children,
    ThemeProvider: ({ children }: any) => children,
    Link: makeHost("Link"),
    // action helpers
    CommonActions: { navigate: _navFn, reset: _navFn, goBack: _navFn },
    StackActions: { push: _navFn, pop: _navFn, replace: _navFn },
    TabActions: { jumpTo: _navFn },
    DrawerActions: { openDrawer: _navFn, closeDrawer: _navFn, toggleDrawer: _navFn },
    // utility fns
    createNavigationContainerRef: () => ({ current: null }),
    createNavigatorFactory: (_comp: any) => () => ({ Navigator: ({ children }: any) => children, Screen: () => null }),
    createStaticNavigation: (_nav: any) => () => null,
    findFocusedRoute: _navFn,
    getActionFromState: _navFn,
    getFocusedRouteNameFromRoute: _navFn,
    getPathFromState: _navFn,
    getStateFromPath: _navFn,
    validatePathConfig: _navFn,
    // themes
    DarkTheme: _mockTheme,
    DefaultTheme: _mockTheme,
    // contexts (needed for re-export consumers)
    LinkingContext: _mockContext,
    LocaleDirContext: _mockContext,
    NavigationContainerRefContext: _mockContext,
    NavigationContext: _mockContext,
    NavigationHelpersContext: _mockContext,
    NavigationMetaContext: _mockContext,
    NavigationRouteContext: _mockContext,
    PreventRemoveContext: _mockContext,
    ThemeContext: _mockContext,
    CurrentRenderContext: _mockContext,
    UNSTABLE_UnhandledLinkingContext: _mockContext,
    // routers (re-exported from @react-navigation/routers via @react-navigation/core)
    BaseRouter: { type: "base", getInitialState: _navFn, getRehydratedState: _navFn, getStateForRouteNamesChange: _navFn, getStateForRouteFocus: _navFn, getStateForAction: _navFn, shouldActionChangeFocus: _navFn },
    DrawerRouter: _navFn,
    StackRouter: _navFn,
    TabRouter: _navFn,
}));

mock.module("@react-navigation/drawer", () => ({
    createDrawerNavigator: () => ({
        Navigator: ({ children }: any) => children ?? null,
        Screen: makeHost("DrawerScreen"),
        Group: makeHost("DrawerGroup"),
    }),
    DrawerContentScrollView: makeHost("DrawerContentScrollView"),
    DrawerItemList: makeHost("DrawerItemList"),
    DrawerItem: makeHost("DrawerItem"),
    useDrawerStatus: () => "closed",
    useDrawerProgress: () => ({ value: 0 }),
}));

mock.module("@react-navigation/bottom-tabs", () => ({
    createBottomTabNavigator: () => ({
        Navigator: ({ children }: any) => children ?? null,
        Screen: makeHost("BottomTabScreen"),
        Group: makeHost("BottomTabGroup"),
    }),
    useBottomTabBarHeight: () => 50,
}));

mock.module("@react-navigation/stack", () => ({
    createStackNavigator: () => ({
        Navigator: ({ children }: any) => children ?? null,
        Screen: makeHost("StackScreen"),
        Group: makeHost("StackGroup"),
    }),
    TransitionPresets: {},
    CardStyleInterpolators: {},
    HeaderStyleInterpolators: {},
}));

mock.module("@react-navigation/native-stack", () => ({
    createNativeStackNavigator: () => ({
        Navigator: ({ children }: any) => children ?? null,
        Screen: makeHost("NativeStackScreen"),
        Group: makeHost("NativeStackGroup"),
    }),
}));

