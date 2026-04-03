import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { AwakeScreen } from "../AwakeScreen";

jest.mock("../../../hooks/useAwake", () => ({
    useAwake: () => ({
        questionnaireButtonPress: jest.fn(),
        skipButtonPress: jest.fn(),
    }),
}));

jest.mock("../../../hooks", () => ({
    useLocale: jest.fn(),
    useConvertibleHeader: jest.fn(),
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
    useAwake: () => ({
        questionnaireButtonPress: jest.fn(),
        skipButtonPress: jest.fn(),
    }),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
}));


const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("AwakeScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<AwakeScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<AwakeScreen />)).not.toThrow();
    });
});
