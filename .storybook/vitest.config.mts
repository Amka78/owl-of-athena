import path from "node:path";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const stubs = (name: string) => path.resolve(import.meta.dirname, "stubs", name);

// expo-modules-core の build/ts-declarations 配下は型定義専用の空ファイル群
// （export {} のみ）。resolve.alias では相対 import に効かないため、load フック
// で実装済みクラスの stub コードに差し替える。
const expoModulesTsDeclarationsStub: any = {
    name: "expo-modules-ts-declarations-stub",
    enforce: "pre",
    load(id: string) {
        if (id.includes("/expo-modules-core/build/ts-declarations/")) {
            return `
export class EventEmitter {
    addListener() { return { remove: () => {} }; }
    removeAllListeners() {}
    emit() {}
}
export class NativeModule {}
export class SharedObject {}
export class SharedRef {}
`;
        }
        return null;
    },
};

// RNGH v3 Gesture API のネイティブブリッジ依存を noop 化する。
// これらの import は相対パス（例: ../../v3/NativeProxy）で、resolve.alias は
// 相対 specifier に適用されないため、resolveId フックで差し替える。
const rnghV3Stub: any = {
    name: "rngh-v3-stub",
    enforce: "pre",
    resolveId(source: string) {
        if (source.includes("v3/NativeProxy")) {
            return stubs("rn/rngh-native-proxy.ts");
        }
        if (source.includes("gestures/installUIRuntimeBindings")) {
            return stubs("rn/rngh-install-ui-runtime-bindings.ts");
        }
        return null;
    },
};
export default defineConfig({
    plugins: [
        storybookTest({
            configDir: ".storybook",
            // The addon starts Storybook itself; --ci skips interactive bits.
            storybookScript: "bun run storybook --ci",
            // Run every story (components with a play function get interaction
            // tests; the rest just render).
            tags: { include: [], exclude: [] },
        }),
        expoModulesTsDeclarationsStub,
        rnghV3Stub,
    ],
    define: {
        // react-native-web のモジュール評価時に __DEV__ が参照される
        __DEV__: "true",
        // expo-modules-core の Platform.js 等が module 評価時に process.env を読む
        "process.env": "({})",
    },
    resolve: {
        // Browser 向け解決: react-native を react-native-web へ差し替え、
        // ネイティブ専用パッケージは stub に置換する（.storybook/vite.config.ts と同方針）。
        mainFields: ["browser", "module", "main"],
        extensions: [
            ".web.tsx",
            ".web.ts",
            ".web.jsx",
            ".web.js",
            ".mjs",
            ".js",
            ".mts",
            ".ts",
            ".jsx",
            ".tsx",
            ".json",
        ],
        alias: [
            // expo-image-picker ships raw TS source as its main entry; the rolldown
            // optimizer fails to parse it in browser mode, and the native module is
            // unavailable anyway - serve a stub module instead.
            {
                find: "expo-image-picker",
                replacement: path.resolve(import.meta.dirname, "./stubs/expo-image-picker.ts"),
            },
            // expo 本体は async-require/HMR が native platform と node "stream" を
            // 要求し browser で壊れる。expo-* 系が使う共有ヘルパーのみ stub 提供。
            // （完全一致 regex で expo-asset / expo-constants 等のサブパッケージを
            // 誤って書き換えない）
            {
                find: /^expo$/,
                replacement: path.resolve(import.meta.dirname, "./stubs/expo.ts"),
            },
            // expo-asset / expo-constants / expo-audio は native モジュールまたは
            // app config 注入を要求するため、テスト環境用の stub に置換する
            // （expo-constants は node 側 setup と同じ Supabase テスト値を供給）。
            {
                find: "expo-asset",
                replacement: path.resolve(import.meta.dirname, "./stubs/expo-asset.ts"),
            },
            {
                find: "expo-audio",
                replacement: path.resolve(import.meta.dirname, "./stubs/expo-audio.ts"),
            },
            {
                find: "expo-constants",
                replacement: path.resolve(import.meta.dirname, "./stubs/expo-constants.ts"),
            },
            // expo-modules-core's entry imports a type-only ts-declarations module
            // that cannot be bundled; stub just that subpath (regex because the
            // import is relative and resolves to an absolute path).
            {
                find: /expo-modules-core\/build\/ts-declarations/,
                replacement: path.resolve(
                    import.meta.dirname,
                    "./stubs/expo-modules-core-ts-declarations.ts",
                ),
            },
            // react-native 内部のサブパスはネイティブ境界の deps (safe-area-context,
            // slider, gesture-handler 等) が import する。bare react-native より先に
            // 解決する必要がある（Vite の文字列 alias は prefix 一致で先勝ち）。
            {
                find: "react-native/Libraries/Utilities/codegenNativeComponent",
                replacement: stubs("rn/codegen-native-component.ts"),
            },
            {
                find: "react-native/Libraries/NativeComponent/NativeComponentRegistry",
                replacement: stubs("rn/native-component-registry.ts"),
            },
            {
                find: "react-native/Libraries/NativeComponent/ViewConfigIgnore",
                replacement: stubs("rn/view-config-ignore.ts"),
            },
            {
                find: "react-native/Libraries/Renderer/shims/ReactNativeViewConfigRegistry",
                replacement: stubs("rn/react-native-view-config-registry.ts"),
            },
            {
                find: "react-native/Libraries/Renderer/shims/ReactFabric",
                replacement: stubs("rn/react-fabric.ts"),
            },
            {
                find: "react-native/Libraries/StyleSheet/processColor",
                replacement: stubs("rn/process-color.ts"),
            },
            {
                find: "react-native/Libraries/Image/resolveAssetSource",
                replacement: stubs("rn/resolve-asset-source.ts"),
            },
            {
                find: "react-native/Libraries/Pressability/PressabilityDebug",
                replacement: stubs("rn/pressability-debug.ts"),
            },
            {
                find: "react-native/Libraries/ReactNative/AppContainer",
                replacement: stubs("rn/app-container.ts"),
            },
            {
                find: "react-native/Libraries/ReactNative/ReactFabricPublicInstance/ReactFabricPublicInstance",
                replacement: stubs("rn/react-fabric-public-instance.ts"),
            },
            // The real react-native ships Flow syntax that neither Vite nor the
            // browser can consume; replace it with react-native-web (+ native-boundary
            // API shims like codegenNativeComponent / TurboModuleRegistry).
            { find: "react-native", replacement: stubs("rn/react-native-shim.ts") },
            // react-native-reanimated: 本体・公式 mock とも CJS/require を含み browser
            // の pre-bundler が壊すため、自己完結の ESM stub に差し替える。
            // 完全一致（regex）でマッチさせ、gesture-handler 等からのサブパス import
            // を誤って書き換えないようにする。
            {
                find: /^react-native-reanimated$/,
                replacement: stubs("rn/reanimated.ts"),
            },
            {
                find: "react-native-reanimated/src/createAnimatedComponent/NativeEventsManager",
                replacement: stubs("rn/reanimated-native-events-manager.ts"),
            },
            {
                find: "react-native-reanimated/scripts/validate-worklets-version",
                replacement: stubs("rn/reanimated-validate-worklets-version.ts"),
            },
            // react-native-worklets: RNGH の gestures 経由で直接 import され、web 上で
            // getUIRuntimeHolder を throw する。reanimated 同様 ESM stub に置換する
            // （API 面は reanimated.ts の stub がカバー）。
            {
                find: "react-native-worklets",
                replacement: stubs("rn/reanimated.ts"),
            },
            // CJS パッケージ invariant も pre-bundler の default export interop が
            // 壊れるため、ESM stub に置換する。
            { find: "invariant", replacement: stubs("rn/invariant.ts") },
            // node の stream は browser では外部化される。AuroraTransformBinary が
            // import 時点で extends Transform するため、import 成立用の stub を提供。
            { find: "stream", replacement: stubs("rn/stream.ts") },
            // react-native-gesture-handler は v3 Gesture API がネイティブブリッジ
            // (RNGestureHandlerModule / worklets) を要求し browser で壊れる。
            // アプリは TouchableOpacity / ScrollView しか使わないため、
            // react-native-web の再エクスポートへ差し替える。
            {
                find: "react-native-gesture-handler",
                replacement: stubs("rn/gesture-handler.ts"),
            },
            // Native-only component: render a host stub in the browser.
            {
                find: "@react-native-community/datetimepicker",
                replacement: path.resolve(import.meta.dirname, "./stubs/datetimepicker.tsx"),
            },
            // react-native-svg: prefer its web variant (avoids fabric native
            // modules that import RN APIs react-native-web does not provide).
            {
                find: "react-native-svg",
                replacement: "react-native-svg/lib/module/ReactNativeSVG.web.js",
            },
            // @expo/vector-icons ships JSX in .js files that Vite 8 cannot parse;
            // render icon names via a text stub instead (glyphs need expo-font).
            // Subpath import (used by react-native-paper) must precede the bare one.
            {
                find: "@expo/vector-icons/MaterialCommunityIcons",
                replacement: path.resolve(import.meta.dirname, "./stubs/vector-icons.tsx"),
            },
            {
                find: "@expo/vector-icons",
                replacement: path.resolve(import.meta.dirname, "./stubs/vector-icons.tsx"),
            },
        ],
    },
    // expo-modules-core は pre-bundle すると内部の相対 import
    // (./ts-declarations/global) が alias を素通りし、型定義専用ファイルの
    // 空 export に対して MISSING_EXPORT になる。pre-bundle から外し、通常の
    // transform 経路で regex alias（下記）を効かせる（メイン設定と同じ方式）。
    optimizeDeps: {
        exclude: [
            "expo-modules-core",
            // CJS パッケージ。pre-bundle 時に rolldown の default export interop が
            // 壊れ "does not provide an export named 'default'" になるため、
            // ランタイム transform の CJS 互換経路に流す
            "invariant",
            // src 配下が TS ソースで optimizer の parse に耐えない（worklets 含む）
            "react-native-reanimated",
        ],
    },
    test: {
        name: "storybook",
        browser: {
            enabled: true,
            // Vitest 5 では provider は文字列ではなく、@vitest/browser-playwright の
            // playwright() が返す provider オブジェクトを渡す
            provider: playwright(),
            headless: true,
            instances: [{ browser: "chromium" }],
        },
        deps: {
            // NOTE: browser モードの deps optimizer は resolveBrowserOptimizeDeps が
            // 内部で構築するため test.deps.optimizer では無効化できない。ネイティブ
            // パッケージは上記 resolve.alias で stub に差し替えて対処する。
        },
        // Storybook 10.3 以降は addon-vitest が preview annotations を自動適用する
        // ため、setProjectAnnotations 専用の setup は不要。ただし browser 実行前に
        // require() 相当（アセット読み込み）を供給するため setup は残す。
        setupFiles: ["./.storybook/vitest.setup.ts"],
    },
});
