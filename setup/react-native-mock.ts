/**
 * Vitest setup: mocks react-native and related RN packages that either ship
 * Flow syntax or native bindings. Loaded via vitest.config.mts setupFiles.
 *
 * react-native itself is replaced through the resolve.alias in vitest.config.mts
 * (alias also covers imports issued from inside node_modules, e.g. RNTL).
 */
import { readFileSync } from "node:fs";
import Module from "node:module";
import path from "node:path";
import React from "react";
import { vi } from "vitest";
import * as RNMock from "../test/mocks/react-native";

// ---------------------------------------------------------------------------
// Binary asset requires (.m4a/.wav/.ttf)
//
// bun mapped [loader] ".m4a" = "file" (require returns the file path) and
// ".ttf" = "text" (require returns the file contents). Node cannot require
// binary assets, so intercept them at the CJS loader level.
// ---------------------------------------------------------------------------
const originalLoad = (Module as any)._load;
(Module as any)._load = function (request: string, parent: any, _isMain: boolean) {
    if (typeof request === "string") {
        // Native require("react-native") (e.g. from vi.mock factories, or CJS
        // builds of deps like react-native-paper) bypasses Vite and would load
        // the real Flow-syntax package. Return the same mock instance that the
        // Vite alias serves, so component identity stays consistent.
        if (request === "react-native") return RNMock;
        // vite-node forwards relative asset specifiers here still unresolved;
        // resolve them against the requiring file like Node would.
        if (request.endsWith(".m4a") || request.endsWith(".wav") || request.endsWith(".ttf")) {
            const resolved = path.resolve(path.dirname(parent?.filename ?? process.cwd()), request);
            if (request.endsWith(".ttf")) return readFileSync(resolved, "utf8");
            return resolved;
        }
    }
    return (originalLoad as any).apply(this, arguments);
};

// ---------------------------------------------------------------------------
// expo-asset  (used by ProfileService / dialogs; requires native module)
// ---------------------------------------------------------------------------
vi.mock("expo-asset", () => {
    const asset = () => ({
        uri: "file:///mocked-asset",
        localUri: "file:///mocked-asset",
        downloadAsync: async () => ({ uri: "" }),
    });
    return {
        Asset: { fromModule: () => asset(), fromURI: () => asset() },
    };
});

// ---------------------------------------------------------------------------
// Globals expected by React Native / Expo at module init time
// ---------------------------------------------------------------------------
(globalThis as any).__DEV__ = true;
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
vi.mock("react-native-safe-area-context", () => {
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
vi.mock("@expo/vector-icons", () => {
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
vi.mock("expo-constants", () => {
    const Constants = {
        expoConfig: {
            name: "owl-of-athena",
            slug: "owl-of-athena",
            extra: {
                channel: undefined as string | undefined,
                supabaseUrl: "https://test.supabase.co",
                supabaseAnonKey: "test-anon-key",
            },
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
vi.mock("expo-keep-awake", () => ({
    activateKeepAwakeAsync: () => Promise.resolve(),
    deactivateKeepAwake: () => Promise.resolve(),
    useKeepAwake: () => {},
}));

// ---------------------------------------------------------------------------
// expo-updates  (used in useAppUpdate.native.ts; no direct test imports)
// ---------------------------------------------------------------------------
vi.mock("expo-updates", () => ({
    checkForUpdateAsync: () => Promise.resolve({ isAvailable: false }),
    fetchUpdateAsync: () => Promise.resolve({ isNew: false }),
    reloadAsync: () => Promise.resolve(),
    useUpdates: () => ({ isUpdateAvailable: false, isUpdatePending: false }),
    UpdateEventType: {
        ERROR: "error",
        NO_UPDATE_AVAILABLE: "noUpdateAvailable",
        UPDATE_AVAILABLE: "updateAvailable",
    },
}));

// ---------------------------------------------------------------------------
// expo-network  (used by useNetworkStatus / OfflineBanner)
// ---------------------------------------------------------------------------
vi.mock("expo-network", () => ({
    getNetworkStateAsync: () => Promise.resolve({ isConnected: true, isInternetReachable: true }),
    addNetworkStateListener: () => ({ remove: () => {} }),
    useNetworkState: () => ({ isConnected: true, isInternetReachable: true }),
    NetworkStateType: {
        NONE: "NONE",
        UNKNOWN: "UNKNOWN",
        CELLULAR: "CELLULAR",
        WIFI: "WIFI",
        BLUETOOTH: "BLUETOOTH",
        ETHERNET: "ETHERNET",
        WIMAX: "WIMAX",
        VPN: "VPN",
        OTHER: "OTHER",
    },
}));

// ---------------------------------------------------------------------------
// react-native subpath: ReactNativeViewConfigRegistry (used by gesture handler)
// ---------------------------------------------------------------------------
vi.mock("react-native/Libraries/Renderer/shims/ReactNativeViewConfigRegistry", () => ({
    customBubblingEventTypes: {},
    customDirectEventTypes: {},
    get: (_name: string) => ({}),
    register: (_name: string, _cfg: any) => ({}),
    registerLazy: (_name: string, _cfg: any) => {},
}));

// ---------------------------------------------------------------------------
// @react-native-picker/picker  (used by FieldLedEffect, SessionListMenu, etc.)
// ---------------------------------------------------------------------------
vi.mock("@react-native-picker/picker", () => {
    const PickerItem = makeHost("Picker.Item");
    const Picker = Object.assign(makeHost("Picker"), { Item: PickerItem });
    return { Picker, PickerIOS: Picker };
});

// ---------------------------------------------------------------------------
// @react-navigation/material-top-tabs  (used by MainScreen tab navigators)
// ---------------------------------------------------------------------------
vi.mock("@react-navigation/material-top-tabs", () => ({
    createMaterialTopTabNavigator: () => ({
        Navigator: ({ children }: any) => children ?? null,
        Screen: makeHost("TopTabScreen"),
        Group: makeHost("TopTabGroup"),
    }),
}));

// ---------------------------------------------------------------------------
// react-native-ble-plx  (native BLE module; used by AuroraBluetooth.native)
// ---------------------------------------------------------------------------
vi.mock("react-native-ble-plx", () => {
    class BleManager {
        constructor() {}
        destroy() {}
    }
    return { BleManager, BleErrorCode: {} };
});

// ---------------------------------------------------------------------------
// react-native-volume-manager  (native volume module; used by SystemVolumeBooster.native)
// ---------------------------------------------------------------------------
vi.mock("react-native-volume-manager", () => {
    const addVolumeListener = () => ({ remove: () => {} });
    return {
        VolumeManager: {
            getVolume: () => Promise.resolve(0.5),
            setVolume: () => Promise.resolve(),
            addVolumeListener,
        },
        addVolumeListener,
        useVolume: () => 0.5,
    };
});

// ---------------------------------------------------------------------------
// @react-native-community/slider  (used by FieldSlider)
// ---------------------------------------------------------------------------
vi.mock("@react-native-community/slider", () => {
    const Slider = makeHost("Slider");
    return { default: Slider, Slider };
});

// ---------------------------------------------------------------------------
// react-native-gesture-handler  (used by ScrollableList via ScrollView import)
// ---------------------------------------------------------------------------
vi.mock("react-native-gesture-handler", () => {
    const mkPressable =
        (name: string) =>
        ({ children, ...rest }: any) => {
            const resolved =
                typeof children === "function" ? children({ pressed: false }) : children;
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
vi.mock("@react-native-community/datetimepicker", () => ({
    default: makeHost("DateTimePicker"),
    DateTimePickerAndroid: {
        open: () => {},
        dismiss: () => {},
    },
    IOSMode: { time: "time", date: "date", datetime: "datetime", countdown: "countdown" },
    AndroidMode: { date: "date", time: "time" },
    AndroidDisplay: {
        default: "default",
        spinner: "spinner",
        clock: "clock",
        calendar: "calendar",
    },
}));

// ---------------------------------------------------------------------------
// expo-localization  (loads fine but keep for completeness)
// ---------------------------------------------------------------------------
// expo-localization loads without mocking (it is pure JS); no mock needed.

// ---------------------------------------------------------------------------
// expo-audio  (requires the native audio module unavailable in test env)
// ---------------------------------------------------------------------------
vi.mock("expo-audio", () => {
    const createMockPlayer = () => ({
        id: "mock-player",
        playing: false,
        muted: false,
        loop: false,
        paused: true,
        isLoaded: true,
        isBuffering: false,
        isAudioSamplingSupported: false,
        currentTime: 0,
        duration: 0,
        volume: 1,
        play: () => undefined,
        pause: () => undefined,
        seekTo: () => Promise.resolve(undefined),
        replace: () => undefined,
        remove: () => undefined,
        setPlaybackRate: () => undefined,
        setActiveForLockScreen: () => undefined,
        addListener: () => ({ remove: () => undefined }),
    });
    return {
        createAudioPlayer: () => createMockPlayer(),
        useAudioPlayer: () => createMockPlayer(),
        setAudioModeAsync: () => Promise.resolve(undefined),
        setIsAudioActiveAsync: () => Promise.resolve(undefined),
        preload: () => Promise.resolve(undefined),
        AudioModule: {},
        AudioPlayer: () => createMockPlayer(),
    };
});

// ---------------------------------------------------------------------------
// noble  (Bluetooth LE library; requires native bindings)
// ---------------------------------------------------------------------------
vi.mock("noble", () => {
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
vi.mock("serialport", () => {
    const { EventEmitter } = require("events") as typeof import("events");
    class SerialPort extends EventEmitter {
        constructor() {
            super();
        }
        open(cb?: (err: null) => void) {
            cb?.(null);
        }
        close(cb?: (err: null) => void) {
            cb?.(null);
        }
        write(_data: any, cb?: (err: null) => void) {
            cb?.(null);
        }
        read() {
            return null;
        }
        pipe() {
            return this;
        }
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
        getAttribute(_k: string) {
            return null;
        },
        appendChild(child: any) {
            return child;
        },
        addEventListener(_e: string, _fn: any) {},
        removeEventListener(_e: string, _fn: any) {},
        dispatchEvent() {
            return true;
        },
        createElementNS(_ns: string, t: string) {
            return makeEl(t);
        },
        querySelectorAll() {
            return [];
        },
        querySelector() {
            return null;
        },
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
vi.mock("react-native-svg", () => ({
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
const _navContext = () => ({
    navigate: _navFn,
    goBack: _navFn,
    dispatch: _navFn,
    reset: _navFn,
    setParams: _navFn,
    setOptions: _navFn,
    isFocused: () => true,
    canGoBack: () => false,
    getParent: () => undefined,
    getState: () => ({}),
});

const _mockTheme = {
    dark: false,
    colors: {
        primary: "#000",
        background: "#fff",
        card: "#fff",
        text: "#000",
        border: "#ccc",
        notification: "#f00",
    },
};
const _mockContext = {
    Provider: ({ children }: any) => children,
    Consumer: () => null,
    displayName: "MockContext",
} as any;

vi.mock("@react-navigation/native", () => ({
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
    createNavigatorFactory: (_comp: any) => () => ({
        Navigator: ({ children }: any) => children,
        Screen: () => null,
    }),
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
    BaseRouter: {
        type: "base",
        getInitialState: _navFn,
        getRehydratedState: _navFn,
        getStateForRouteNamesChange: _navFn,
        getStateForRouteFocus: _navFn,
        getStateForAction: _navFn,
        shouldActionChangeFocus: _navFn,
    },
    DrawerRouter: _navFn,
    StackRouter: _navFn,
    TabRouter: _navFn,
}));

vi.mock("@react-navigation/drawer", () => ({
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

vi.mock("@react-navigation/bottom-tabs", () => ({
    createBottomTabNavigator: () => ({
        Navigator: ({ children }: any) => children ?? null,
        Screen: makeHost("BottomTabScreen"),
        Group: makeHost("BottomTabGroup"),
    }),
    useBottomTabBarHeight: () => 50,
}));

vi.mock("@react-navigation/stack", () => ({
    createStackNavigator: () => ({
        Navigator: ({ children }: any) => children ?? null,
        Screen: makeHost("StackScreen"),
        Group: makeHost("StackGroup"),
    }),
    TransitionPresets: {},
    CardStyleInterpolators: {},
    HeaderStyleInterpolators: {},
}));

vi.mock("@react-navigation/native-stack", () => ({
    createNativeStackNavigator: () => ({
        Navigator: ({ children }: any) => children ?? null,
        Screen: makeHost("NativeStackScreen"),
        Group: makeHost("NativeStackGroup"),
    }),
}));

// ---------------------------------------------------------------------------
// @react-native-async-storage/async-storage
// Supabase auth と zustand persist が web 版の window.localStorage を
// 参照してテスト環境で落ちるため、メモリ実装に差し替える。
// ---------------------------------------------------------------------------
vi.mock("@react-native-async-storage/async-storage", () => {
    const storage = new Map<string, string>();
    const AsyncStorage = {
        getItem: async (key: string) => storage.get(key) ?? null,
        setItem: async (key: string, value: string) => {
            storage.set(key, value);
        },
        removeItem: async (key: string) => {
            storage.delete(key);
        },
        mergeItem: async (key: string, value: string) => {
            storage.set(key, value);
        },
        clear: async () => {
            storage.clear();
        },
        getAllKeys: async () => Array.from(storage.keys()),
        multiGet: async (keys: string[]) => keys.map((key) => [key, storage.get(key) ?? null]),
        multiSet: async (pairs: [string, string][]) => {
            for (const [key, value] of pairs) storage.set(key, value);
        },
        multiRemove: async (keys: string[]) => {
            for (const key of keys) storage.delete(key);
        },
        multiMerge: async (pairs: [string, string][]) => {
            for (const [key, value] of pairs) storage.set(key, value);
        },
        flushGetRequests: () => {},
    };

    return {
        default: AsyncStorage,
        ...AsyncStorage,
        useAsyncStorage: (key: string) => ({
            getItem: async () => storage.get(key) ?? null,
            setItem: async (value: string) => {
                storage.set(key, value);
            },
            removeItem: async () => {
                storage.delete(key);
            },
            mergeItem: async (value: string) => {
                storage.set(key, value);
            },
        }),
    };
});
