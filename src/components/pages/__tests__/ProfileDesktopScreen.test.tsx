import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { ProfileDesktopScreen } from "../ProfileDesktopScreen";

vi.mock("../../../navigation/ProfileTabNavigator", () => ({ default: () => null }));
vi.mock("react-native-reanimated", () => require("react-native-reanimated/mock"));

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
        width: 1200,
        height: 900,
        isDesktop: true,
        isLargeWidth: true,
        isSmallHeight: false,
        isVertical: false,
        isHorizontal: true,
        fontScale: 1,
        scale: 1,
    }),
}));

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("ProfileDesktopScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<ProfileDesktopScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<ProfileDesktopScreen />)).not.toThrow();
    });
});
