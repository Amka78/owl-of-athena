//#region Import Modules
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

//#endregion

//#region Constants
const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
//#endregion

//#region Tests
describe("native entry point", () => {
    test("package.json の main は index.js を指す", () => {
        const pkg = JSON.parse(readFileSync(join(projectRoot, "package.json"), "utf8")) as {
            main?: string;
        };

        expect(pkg.main).toBe("index.js");
    });

    test("index.js 以外のルート index.* を置かない", () => {
        // Expo はエントリの拡張子を落として Metro に渡すため、index.ts があると
        // .ts が優先され、AppRegistry に "main" が登録されず起動直後に落ちる。
        expect(existsSync(join(projectRoot, "index.ts"))).toBe(false);
        expect(existsSync(join(projectRoot, "index.tsx"))).toBe(false);
        expect(existsSync(join(projectRoot, "index.jsx"))).toBe(false);
    });
});
//#endregion
