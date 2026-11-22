// Web stub for expo-image-picker. The package ships TypeScript source as its
// `main` entry (src/ImagePicker.ts); Vite's rolldown optimizer cannot parse it
// and the native module does not exist in the browser test environment.
export const requestMediaLibraryPermissionsAsync = async () => ({
    granted: false,
    status: "undetermined",
    canAskAgain: true,
    expires: "never",
});

export const requestCameraPermissionsAsync = async () => ({
    granted: false,
    status: "undetermined",
    canAskAgain: true,
    expires: "never",
});

export const launchImageLibraryAsync = async () => ({
    canceled: true,
    assets: null,
});

export const launchCameraAsync = async () => ({
    canceled: true,
    assets: null,
});

export const getMediaLibraryPermissionsAsync = async () => ({
    granted: false,
    status: "undetermined",
    canAskAgain: true,
    expires: "never",
});

export const MediaTypeOptions = {
    All: "All",
    Videos: "Videos",
    Images: "Images",
};
