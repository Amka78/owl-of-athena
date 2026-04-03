module.exports = {
    preset: "jest-expo",
    setupFilesAfterEnv: [
        "<rootDir>/setup-tests.js",
        "<rootDir>/setup-fetch.js",
    ],
    transform: {
        "^.+\\.[jt]sx?$": "babel-jest",
    },
    transformIgnorePatterns: [
        "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@storybook/.*))",
    ],
    moduleNameMapper: {
        "\\.svg$": "<rootDir>/__mocks__/svgMock.js",
        "^@react-native-async-storage/async-storage$":
            "@react-native-async-storage/async-storage/jest/async-storage-mock",
    },
    testPathIgnorePatterns: ["/node_modules/", "/android/", "/ios/"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
    globals: {
        "ts-jest": {
            tsconfig: "./tsconfig.jest.json",
        },
    },
    modulePaths: ["<rootDir>"],
    testEnvironment: "jsdom",
};
