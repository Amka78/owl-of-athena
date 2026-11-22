import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { ProfileListScreen } from "../ProfileListScreen";

vi.mock("../../../hooks/profiles/useProfileList", () => ({
    useProfileList: () => ({
        showFilter: false,
        filterCondition: {
            showOfficial: true,
            showCommunity: true,
            showPrivate: true,
        },
        onShowOfficialPress: vi.fn(),
        onShowCommunityPress: vi.fn(),
        onShowPrivatePress: vi.fn(),
        onFilterPress: vi.fn(),
        onRefreshPress: vi.fn(),
        userId: "guest",
        list: [],
        onStarPress: vi.fn(),
        onSelectProfile: vi.fn(),
        onDeleteProfile: vi.fn(),
    }),
}));

vi.mock("../../../hooks", () => ({
    useScreenDimensions: () => ({ isDesktop: false, isSmallHeight: false }),
    useLocale: vi.fn(),
    useConvertibleHeader: vi.fn(),
    useWindowDimensions: () => ({
        width: 375,
        height: 800,
        isDesktop: false,
        isLargeWidth: false,
        isSmallHeight: false,
        isVertical: true,
        isHorizontal: false,
        fontScale: 1,
        scale: 2,
    }),
}));

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("ProfileListScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<ProfileListScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<ProfileListScreen />)).not.toThrow();
    });
});
