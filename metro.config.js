const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  transformer: {
    ...defaultConfig.transformer,
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  },
  resolver: {
    ...defaultConfig.resolver,
    // Ensure .native.ts files are resolved before .ts for iOS/Android
    sourceExts: [...(defaultConfig.resolver?.sourceExts || [])],
  },
};
