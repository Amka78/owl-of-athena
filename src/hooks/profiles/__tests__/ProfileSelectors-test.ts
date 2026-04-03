import { renderHook } from "@testing-library/react-native";

const mockProfile = { id: "p1", type: "official", name: "test.prof" };
const mockFilterCondition = {
    showOfficial: true,
    showCommunity: true,
    showPrivate: true,
};

jest.mock("react-redux", () => ({
    useSelector: jest.fn((selector: any) =>
        selector({
            profile: {
                list: [mockProfile],
                filteredList: [mockProfile],
                selected: mockProfile,
                filterCondition: mockFilterCondition,
            },
            auth: {},
            aurora: {},
            app: {},
            session: {},
        })
    ),
    useDispatch: () => jest.fn(),
}));

import { useProfileListSelector } from "../useProfileListSelector";
import { useFilteredProfileListSelector } from "../useFilteredProfileListSelector";
import { useSelectedProfileSelector } from "../useSelectedProfileSelector";
import { useFilterConditionSelector } from "../useFilteredConditionSelector";

describe("Profile selector hooks", () => {
    it("useProfileListSelector returns profile list", () => {
        const { result } = renderHook(() => useProfileListSelector());
        expect(result.current).toEqual([mockProfile]);
    });

    it("useFilteredProfileListSelector returns filteredList", () => {
        const { result } = renderHook(() => useFilteredProfileListSelector());
        expect(result.current).toEqual([mockProfile]);
    });

    it("useSelectedProfileSelector returns selected profile", () => {
        const { result } = renderHook(() => useSelectedProfileSelector());
        expect(result.current).toEqual(mockProfile);
    });

    it("useFilterConditionSelector returns filterCondition", () => {
        const { result } = renderHook(() => useFilterConditionSelector());
        expect(result.current).toEqual(mockFilterCondition);
    });
});
