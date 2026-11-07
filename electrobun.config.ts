import type { ElectrobunConfig } from "electrobun";

const config: ElectrobunConfig = {
    app: {
        name: "Owl of Athena",
        identifier: "org.iwinks.owl-of-athena",
        // CI の手動リリースでは入力バージョンを渡す。
        version: process.env.ELECTROBUN_APP_VERSION ?? "1.0.0",
    },
    build: {
        // Expo web の出力をアプリの Resources へコピーする。
        // main.ts は ../dist/index.html を読む。
        bun: {
            entrypoint: "./src-electrobun/main.ts",
        },
        copy: {
            "./dist": "dist",
        },
        buildFolder: "./dist-desktop",
        artifactFolder: "./dist-desktop-artifacts",
    },
};

export default config;