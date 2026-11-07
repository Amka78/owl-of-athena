import { BrowserWindow } from "electrobun/bun";
import path from "node:path";
import { pathToFileURL } from "node:url";

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

mainWindow.show();