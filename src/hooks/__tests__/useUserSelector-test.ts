import { renderHook } from "@testing-library/react-native";

const mockUser = { id: "user-1", birthday: "2000-01-01" };

jest.mock("react-redux", () => ({
    useSelector: jest.fn((selector: any) =>
        selector({
            auth: { user: mockUser },
            aurora: {},
            app: {},
            profile: {},
            session: {},
        })
    ),
    useDispatch: () => jest.fn(),
}));

import { useUserSelector } from "../useUserSelector";

describe("useUserSelector", () => {
    it("returns user from state", () => {
        const { result } = renderHook(() => useUserSelector());
        expect(result.current).toEqual(mockUser);
    });
});
