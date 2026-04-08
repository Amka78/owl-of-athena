import type { ElectrobunConfig } from "electrobun";

const config: ElectrobunConfig = {
    appName: "Owl of Athena",
    productName: "Owl of Athena",
    version: "1.0.0",
    main: "./src-electrobun/main.ts",
    build: {
        outDir: "./dist-desktop",
        webview: {
            // Expo web output directory
            staticDir: "./dist",
        },
    },
    mac: {
        bundleId: "org.iwinks.owl-of-athena",
        icon: "./assets/icon.png",
    },
    win: {
        icon: "./assets/icon.png",
    },
};

export default config;
