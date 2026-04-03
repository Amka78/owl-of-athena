import { renderHook } from "@testing-library/react-native";

jest.mock("react-redux", () => ({
    useSelector: jest.fn((selector: any) =>
        selector({
            auth: { token: "my-token" },
            aurora: {},
            app: {},
            profile: {},
            session: {},
        })
    ),
    useDispatch: () => jest.fn(),
}));

import { useTokenSelector } from "../useTokenSelector";

describe("useTokenSelector", () => {
    it("returns token from state", () => {
        const { result } = renderHook(() => useTokenSelector());
        expect(result.current).toBe("my-token");
    });
});
