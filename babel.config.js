module.exports = (api) => {
    api.cache(true);
    return {
        // react-native-reanimated/plugin は babel-preset-expo が worklets プラグインを
        // 自動追加するため手動登録しない（二重適用を防ぎ、React Compiler を先に通す）。
        presets: [["babel-preset-expo", { unstable_transformImportMeta: true }]],
    };
};
