import { renderHook } from "@testing-library/react-native";
import { useWindowDimensions } from "../useWindowDimensions";

describe("useWindowDimensions", () => {
    it("returns an object with required dimension fields", () => {
        const { result } = renderHook(() => useWindowDimensions());
        expect(typeof result.current.width).toBe("number");
        expect(typeof result.current.height).toBe("number");
        expect(typeof result.current.scale).toBe("number");
        expect(typeof result.current.fontScale).toBe("number");
    });

    it("returns boolean flags", () => {
        const { result } = renderHook(() => useWindowDimensions());
        expect(typeof result.current.isDesktop).toBe("boolean");
        expect(typeof result.current.isHorizontal).toBe("boolean");
        expect(typeof result.current.isVertical).toBe("boolean");
        expect(typeof result.current.isLargeWidth).toBe("boolean");
        expect(typeof result.current.isSmallHeight).toBe("boolean");
    });

    it("isHorizontal and isVertical are mutually exclusive", () => {
        const { result } = renderHook(() => useWindowDimensions());
        expect(result.current.isHorizontal).toBe(!result.current.isVertical);
    });

    it("isVertical is true when width < height", () => {
        const { result } = renderHook(() => useWindowDimensions());
        if (result.current.width < result.current.height) {
            expect(result.current.isVertical).toBe(true);
        } else {
            expect(result.current.isHorizontal).toBe(true);
        }
    });
});
