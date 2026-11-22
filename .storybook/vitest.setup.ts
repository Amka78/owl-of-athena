// Storybook browser テスト用の setup:
// アプリコードが require() でアセット（.m4a / .wav / .ttf 等）や qs を読み込む
// 箇所がある（SoundManager / ProfileService / RestClient）。browser には require
// が無いため、アセット相当はモジュールスタブを返す。vi.mock ファクトリ内の
// require("react") / require("react-native") は実モジュールを返す（それ以外は
// 既存の require（存在する場合）へ委譲）。
import * as React from "react";
import * as ReactNativeWeb from "react-native-web";

// Node 由来の `global` を参照するライブラリ（react-native-paper の Menu 等）向け
(globalThis as { global?: unknown }).global = globalThis;

const existingRequire = (globalThis as { require?: (id: string) => unknown }).require;

(globalThis as { require: (id: string) => unknown }).require = (id: string): unknown => {
    if (typeof id !== "string") {
        return {};
    }
    if (
        id.endsWith(".m4a") ||
        id.endsWith(".wav") ||
        id.endsWith(".mp3") ||
        id.endsWith(".ttf") ||
        id.endsWith(".png") ||
        id.endsWith(".jpg") ||
        id.endsWith(".jpeg") ||
        id === "qs"
    ) {
        return { default: "" };
    }
    if (id === "react") {
        return React;
    }
    if (id === "react-native") {
        return ReactNativeWeb;
    }
    if (typeof existingRequire === "function") {
        return existingRequire(id);
    }
    return {};
};