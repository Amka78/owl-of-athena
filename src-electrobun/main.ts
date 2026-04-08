import { Electrobun, BrowserWindow } from "electrobun";
import path from "path";

//#region App configuration
const app = new Electrobun({
    appName: "Owl of Athena",
});
//#endregion

//#region Main window
app.on("ready", () => {
    const distPath = path.resolve(import.meta.dir, "..", "dist", "index.html");

    const mainWindow = new BrowserWindow({
        title: "Owl of Athena",
        width: 1280,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        html: distPath,
    });

    mainWindow.webview.loadURL(
        process.env.NODE_ENV === "development"
            ? "http://localhost:19006"
            : `file://${distPath}`
    );

    mainWindow.show();
});
//#endregion

//#region RPC handlers
app.on("rpc", (event: any) => {
    const { method } = event;
    switch (method) {
        case "getAppVersion":
            return { version: "1.0.0" };
        case "getPlatform":
            return { platform: process.platform };
        default:
            return { error: `Unknown method: ${method}` };
    }
});
//#endregion
