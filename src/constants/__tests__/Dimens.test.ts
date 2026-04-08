import Dimens from "../Dimens";

describe("Dimens", () => {
    it("exports numeric dimension values", () => {
        expect(typeof Dimens.toolbar_title_text_size).toBe("number");
        expect(typeof Dimens.button_height).toBe("number");
        expect(typeof Dimens.button_radius).toBe("number");
        expect(typeof Dimens.navbar_height).toBe("number");
        expect(typeof Dimens.content_text_size).toBe("number");
        expect(typeof Dimens.input_text_size).toBe("number");
    });

    it("has positive dimension values", () => {
        expect(Dimens.button_height).toBeGreaterThan(0);
        expect(Dimens.navbar_height).toBeGreaterThan(0);
        expect(Dimens.content_text_size).toBeGreaterThan(0);
    });

    it("exports inner_screen_max_height and inner_screen_max_width", () => {
        expect(typeof Dimens.inner_screen_max_height).toBe("number");
        expect(typeof Dimens.inner_screen_max_width).toBe("number");
    });

    it("exports session-related dimensions", () => {
        expect(typeof Dimens.session_margin_left).toBe("number");
        expect(typeof Dimens.session_margin_right).toBe("number");
        expect(Dimens.session_margin_left).toBe(30);
        expect(Dimens.session_margin_right).toBe(30);
    });

    it("exports checkbox dimensions", () => {
        expect(typeof Dimens.checkbox_outer_diameter).toBe("number");
        expect(typeof Dimens.checkbox_inner_diameter).toBe("number");
    });
});
