import { renderHook } from "@testing-library/react-native";

jest.mock("react-redux", () => ({
    useSelector: jest.fn((selector: any) =>
        selector({
            app: { wakeLock: true },
            auth: {},
            aurora: {},
            profile: {},
            session: {},
        })
    ),
    useDispatch: () => jest.fn(),
}));

import { useWakeLockSelector } from "../useWakeLockSelector";

describe("useWakeLockSelector", () => {
    it("returns wakeLock value from state", () => {
        const { result } = renderHook(() => useWakeLockSelector());
        expect(result.current).toBe(true);
    });
});
