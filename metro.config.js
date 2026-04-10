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
    // Polyfill Node.js built-in modules for web
    extraNodeModules: {
      stream: path.resolve(__dirname, "node_modules/readable-stream"),
    },
  },
};
