import { renderHook, act } from "@testing-library/react-native";
import { useTextBox } from "../useTextBox";

describe("useTextBox", () => {
    it("returns initial value", () => {
        const { result } = renderHook(() => useTextBox("hello"));
        expect(result.current.value).toBe("hello");
    });

    it("updates value via onChangeText", () => {
        const { result } = renderHook(() => useTextBox(""));
        act(() => {
            result.current.onChangeText("new text");
        });
        expect(result.current.value).toBe("new text");
    });

    it("updates value via set", () => {
        const { result } = renderHook(() => useTextBox("initial"));
        act(() => {
            result.current.set("updated");
        });
        expect(result.current.value).toBe("updated");
    });

    it("exposes onChangeText, set, and value", () => {
        const { result } = renderHook(() => useTextBox(""));
        expect(typeof result.current.onChangeText).toBe("function");
        expect(typeof result.current.set).toBe("function");
        expect(typeof result.current.value).toBe("string");
    });
});
