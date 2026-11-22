// Web stub for expo-asset: the real package requires a native module
// (ExpoAsset) that does not exist in the browser test environment. Mirror the
// node-side mock used by setup/react-native-mock.ts.
const asset = () => ({
    uri: "file:///mocked-asset",
    localUri: "file:///mocked-asset",
    downloadAsync: async () => ({ uri: "" }),
});

export const Asset = {
    fromModule: () => asset(),
    fromURI: () => asset(),
};

export const useAssets = () => [undefined, undefined] as const;

export default { Asset, useAssets };
