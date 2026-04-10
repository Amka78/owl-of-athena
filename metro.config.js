const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  transformer: {
    ...defaultConfig.transformer,
    assetPlugins: ["expo-asset/tools/hashAssetFiles"],
  },
  resolver: {
    ...defaultConfig.resolver,
    // Ensure .native.ts files are resolved before .ts for iOS/Android
    sourceExts: [...(defaultConfig.resolver?.sourceExts || [])],
    // Polyfill Node.js built-in modules for web.
    // "stream" points to a shim that sets up process.nextTick
    // BEFORE loading readable-stream, since readable-stream v3
    // uses bare `process.nextTick` global at runtime.
    extraNodeModules: {
      stream: path.resolve(__dirname, "shims/stream.js"),
      process: path.resolve(__dirname, "node_modules/process/browser.js"),
      buffer: path.resolve(__dirname, "node_modules/buffer"),
    },
  },
};
