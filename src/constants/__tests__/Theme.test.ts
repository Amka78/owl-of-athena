import { Theme } from "../Theme";

describe("Theme", () => {
    it("exports Theme object", () => {
        expect(Theme).toBeDefined();
        expect(typeof Theme).toBe("object");
    });

    it("has colors property", () => {
        expect(Theme.colors).toBeDefined();
    });

    it("has primary color", () => {
        expect(Theme.colors.primary).toBeDefined();
        expect(typeof Theme.colors.primary).toBe("string");
    });

    it("has background color", () => {
        expect(Theme.colors.background).toBeDefined();
    });

    it("has error color", () => {
        expect(Theme.colors.error).toBeDefined();
    });

    it("has roundness property", () => {
        expect(Theme.roundness).toBe(2);
    });
});
