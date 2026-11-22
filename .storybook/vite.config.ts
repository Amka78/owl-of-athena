import path from "node:path";

// react-native-svg's web variant still imports RN's TurboModuleRegistry,
// which react-native-web does not export; append a stub so named-export
// checking passes and the module resolves at runtime.
const patchReactNativeWeb: any = {
    name: "patch-react-native-web",
    transform(code: string, id: string) {
        if (id.endsWith("/react-native-web/dist/index.js")) {
            return (
                code +
                "\n;export const TurboModuleRegistry = { get: () => null, getEnforcing: () => ({}), getByName: () => null };"
            );
        }
        return null;
    },
};

// Vite configuration for the Storybook (react-vite builder). Referenced from
// .storybook/main.js via framework.options.builder.viteConfigPath.
export default {
    plugins: [patchReactNativeWeb],
    resolve: {
        // Expo modules ship browser builds; without this, their node entries pull
        // in expo-modules-core's TypeScript declarations as if they were runtime.
        mainFields: ["browser", "module", "main"],
        // Platform-specific source resolution: prefer ".web.*" variants, never
        // ".native.*" (mirrors Metro's web resolution).
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
            // Replaces the Flow-typed react-native with its web implementation.
            { find: "react-native", replacement: "react-native-web" },
            // Native-only component: render a host stub on web.
            {
                find: "@react-native-community/datetimepicker",
                replacement: path.resolve(import.meta.dirname, "./stubs/datetimepicker.tsx"),
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
    optimizeDeps: {
        // Native-adjacent packages ship Flow source, JSX-in-js, or platform
        // variants that the rolldown optimizer chokes on. Leave them out so they
        // go through Vite's regular transform pipeline, where the aliases above
        // and the ".web.*" extension resolution apply.
        exclude: [
            "@react-native-community/datetimepicker",
            "react-native-svg",
            "react-native-paper",
            "expo-constants",
            "expo-modules-core",
            "expo-updates",
            "expo-font",
            "expo-asset",
            "expo-audio",
            "expo-network",
            "expo-keep-awake",
            "expo-localization",
            "expo-sharing",
            "expo-file-system",
            "expo-image-picker",
            // CJS の default export interop が rolldown optimizer で壊れる / TS ソース
            // を parse できないパッケージ（vite.config で解決）
            "invariant",
            "react-native-reanimated",
            "react-native-worklets",
        ],
    },
};
