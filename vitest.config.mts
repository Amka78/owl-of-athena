import path from "node:path";
import { defineConfig } from "vitest/config";

const mock = (name: string) => path.resolve(import.meta.dirname, "test/mocks", name);

/**
 * Vite SSR does not load binary assets (paper's .png icons etc.); intercept
 * them at resolve time and serve a stub module. enforce: "pre" runs before
 * Vite's SSR externalization, and the virtual id also covers absolute-path
 * imports emitted by the prebundled deps.
 */
const assetStub: any = {
    name: "asset-stub",
    enforce: "pre",
    resolveId(id: string) {
        if (/\.(png|jpe?g|gif|webp|svg)$/i.test(id) && !id.startsWith("\0")) {
            return "\0asset:" + id;
        }
        return null;
    },
    load(id: string) {
        if (id.startsWith("\0asset:")) return "export default '';";
        return null;
    },
};

export default defineConfig({
    plugins: [assetStub],
    // Prefer the ESM build ("module" field) of CJS-dual packages such as
    // react-native-paper: their ESM build uses import/export, which Vite's SSR
    // loader rewrites and routes through resolve.alias. The CJS build keeps
    // require() native, which bypasses aliases and mocks (vitest docs: "Calls
    // to require() always use Node.js directly").
    ssr: {
        resolve: {
            mainFields: ["module", "jsnext:main", "jsnext", "main"],
        },
    },
    resolve: {
        alias: [
            // react-native subpaths must precede the bare "react-native" alias
            // (Vite string aliases also match sub-paths).
            {
                find: "react-native/Libraries/Utilities/codegenNativeComponent",
                replacement: mock("codegen-native-component.ts"),
            },
            {
                find: "react-native/Libraries/NativeComponent/NativeComponentRegistry",
                replacement: mock("native-component-registry.ts"),
            },
            {
                find: "react-native/Libraries/Renderer/shims/ReactNativeViewConfigRegistry",
                replacement: mock("react-native-view-config-registry.ts"),
            },
            // The real react-native ships Flow syntax that neither Vite nor Node can
            // consume, so every import (src code AND node_modules like RNTL) resolves
            // to the mock module instead.
            { find: "react-native", replacement: mock("react-native.ts") },
        ],
    },
    test: {
        globals: true,
        environment: "node",
        setupFiles: ["./setup/react-native-mock.ts", "./setup-tests.js", "./setup-fetch.js"],
        include: ["src/**/*.test.{ts,tsx}"],
        server: {
            deps: {
                // Force CJS deps that internally require("react-native") through
                // Vite's module runner so the alias above replaces react-native with
                // the mock (externalized CJS keeps require() native and bypasses it).
                inline: [
                    "@testing-library/react-native",
                    "react-native-paper",
                    // Binary assets must not fall through to Node's require (unknown
                    // file extension); route them through Vite so assetStub can serve
                    // a stub module.
                    /\.(png|jpe?g|gif|webp|svg)$/,
                ],
            },
        },
        deps: {
            optimizer: {
                ssr: {
                    // RNTL has no ESM build, so some of its CJS files keep require()
                    // native and bypass the react-native alias. Pre-bundling it bakes
                    // the mock in at build time (aliases apply during optimization).
                    // NOTE: react-native-paper must NOT be pre-bundled here: rolldown
                    // externalizes paper's binary imports (.png), which then fail to
                    // load natively. Paper instead resolves through its ESM build via
                    // ssr.resolve.mainFields below.
                    enabled: true,
                    include: ["@testing-library/react-native"],
                    // Some RN packages (e.g. @expo/vector-icons pulled in by RNTL deps)
                    // ship JSX inside .js files; let the optimizer parse them.
                    esbuildOptions: {
                        loader: { ".js": "jsx" },
                    },
                },
            },
        },
        coverage: {
            provider: "v8",
            include: ["src/**/*.{ts,tsx}"],
        },
    },
});
