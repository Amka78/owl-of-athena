import { renderHook, act } from "@testing-library/react-native";
import { useCheckBox } from "../useCheckBox";

describe("useCheckBox", () => {
    it("returns unchecked status when initialized with false", () => {
        const { result } = renderHook(() => useCheckBox(false));
        expect(result.current.status).toBe("unchecked");
    });

    it("returns checked status when initialized with true", () => {
        const { result } = renderHook(() => useCheckBox(true));
        expect(result.current.status).toBe("checked");
    });

    it("toggles from unchecked to checked on press", () => {
        const { result } = renderHook(() => useCheckBox(false));
        act(() => {
            result.current.onPress();
        });
        expect(result.current.status).toBe("checked");
    });

    it("toggles from checked to unchecked on press", () => {
        const { result } = renderHook(() => useCheckBox(true));
        act(() => {
            result.current.onPress();
        });
        expect(result.current.status).toBe("unchecked");
    });

    it("exposes onPress function", () => {
        const { result } = renderHook(() => useCheckBox(false));
        expect(typeof result.current.onPress).toBe("function");
    });
});
