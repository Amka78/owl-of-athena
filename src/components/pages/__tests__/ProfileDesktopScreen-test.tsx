import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { ProfileDesktopScreen } from "../ProfileDesktopScreen";

jest.mock("../../../navigation/ProfileTabNavigator", () => () => null);
jest.mock("react-native-reanimated", () =>
    require("react-native-reanimated/mock")
);

jest.mock("../../../hooks/profiles/useProfileList", () => ({
    useProfileList: () => ({
        showFilter: false,
        filterCondition: {
            showOfficial: true,
            showCommunity: true,
            showPrivate: true,
        },
        onShowOfficialPress: jest.fn(),
        onShowCommunityPress: jest.fn(),
        onShowPrivatePress: jest.fn(),
        onFilterPress: jest.fn(),
        onRefreshPress: jest.fn(),
        userId: "guest",
        list: [],
        onStarPress: jest.fn(),
        onSelectProfile: jest.fn(),
        onDeleteProfile: jest.fn(),
    }),
}));

jest.mock("../../../hooks", () => ({
    useScreenDimensions: () => ({ isDesktop: false, isSmallHeight: false }),
    useLocale: jest.fn(),
    useConvertibleHeader: jest.fn(),
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

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
}));

jest.mock("react-redux", () => ({
    useSelector: jest.fn(() => ({})),
    useDispatch: () => jest.fn(),
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
