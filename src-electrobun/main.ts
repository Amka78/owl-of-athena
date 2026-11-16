import path from "node:path";
import { pathToFileURL } from "node:url";
import { ApplicationMenu, BrowserWindow } from "electrobun/bun";

// Expo の Web 出力。electrobun.config.ts の build.copy で
// Resources/dist にコピーされる。
const distPath = path.resolve(import.meta.dir, "..", "dist", "index.html");

const mainWindow = new BrowserWindow({
    title: "Owl of Athena",
    frame: {
        x: 0,
        y: 0,
        width: 1280,
        height: 800,
    },
    url: pathToFileURL(distPath).href,
});

// 参照実装（iwinks-desktop-app）と同じく、デバイス保守を
// ネイティブメニューバーの Aurora メニューに配置する。
const AURORA_MENU_ACTION_PREFIX = "owl-aurora:";

ApplicationMenu.setApplicationMenu([
    {
        label: "Owl of Athena",
        submenu: [{ role: "about" }, { type: "divider" }, { role: "quit" }],
    },
    {
        label: "Edit",
        submenu: [
            { role: "undo" },
            { role: "redo" },
            { type: "divider" },
            { role: "cut" },
            { role: "copy" },
            { role: "paste" },
            { role: "selectAll" },
        ],
    },
    {
        label: "Aurora",
        submenu: [
            { label: "Firmware Info", action: `${AURORA_MENU_ACTION_PREFIX}firmware-info` },
            { type: "divider" },
            { label: "Reset Device", action: `${AURORA_MENU_ACTION_PREFIX}reset-device` },
            { label: "Format SD Card", action: `${AURORA_MENU_ACTION_PREFIX}format-sd` },
        ],
    },
    {
        label: "Window",
        submenu: [{ role: "minimize" }, { role: "toggleFullScreen" }],
    },
    {
        label: "Help",
        submenu: [{ role: "showHelp" }],
    },
]);

// クリックはビュー（React Native Web）側のハンドラへ JSON 文字列で届ける。
// テンプレートリテラルではなく JSON.stringify でエスケープすることで、
// アクション名に引用符が含まれても安全に埋め込める。
ApplicationMenu.on("application-menu-clicked", (event: unknown) => {
    const action = (event as { action?: unknown } | null | undefined)?.action;
    if (typeof action !== "string" || !action.startsWith(AURORA_MENU_ACTION_PREFIX)) return;
    mainWindow.webview?.executeJavascript(
        `window.__owlAuroraMenu && window.__owlAuroraMenu(${JSON.stringify(action)})`,
    );
});

mainWindow.show();
