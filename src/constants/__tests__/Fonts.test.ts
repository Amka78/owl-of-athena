import Fonts from "../Fonts";

describe("Fonts", () => {
    it("exports primaryRegular as a string", () => {
        expect(typeof Fonts.primaryRegular).toBe("string");
        expect(Fonts.primaryRegular.length).toBeGreaterThan(0);
    });

    it("exports primarySemiBold as a string", () => {
        expect(typeof Fonts.primarySemiBold).toBe("string");
        expect(Fonts.primarySemiBold.length).toBeGreaterThan(0);
    });

    it("primaryRegular has expected value", () => {
        expect(Fonts.primaryRegular).toBe("calibre_app_regular");
    });

    it("primarySemiBold has expected value", () => {
        expect(Fonts.primarySemiBold).toBe("calibre_app_semibold");
    });
});
