import Colors from "../Colors";

describe("Colors", () => {
    it("exports teal color", () => {
        expect(Colors.teal).toBe("#00ffe6");
    });

    it("exports white color", () => {
        expect(Colors.white).toBe("#ffffff");
    });

    it("exports navy color", () => {
        expect(typeof Colors.navy).toBe("string");
        expect(Colors.navy).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it("exports red color", () => {
        expect(Colors.red).toBe("#ff4310");
    });

    it("all colors are hex strings", () => {
        const hexPattern = /^#[0-9a-fA-F]{6,8}$/;
        expect(Colors.teal).toMatch(hexPattern);
        expect(Colors.purple).toMatch(hexPattern);
        expect(Colors.white).toMatch(hexPattern);
        expect(Colors.navy).toMatch(hexPattern);
        expect(Colors.cyan).toMatch(hexPattern);
        expect(Colors.yellow).toMatch(hexPattern);
    });

    it("exports aurora_connected and aurora_disconnected", () => {
        expect(Colors.aurora_connected).toBeDefined();
        expect(Colors.aurora_disconnected).toBeDefined();
    });
});
