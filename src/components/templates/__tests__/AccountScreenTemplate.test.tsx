import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { AccountScreenTemplate } from "../AccountScreenTemplate";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const mobileDimens = {
    fontScale: 1,
    scale: 1,
    height: 800,
    width: 400,
    isDesktop: false,
    isLargeWidth: false,
    isSmallHeight: false,
    isVertical: true,
    isHorizontal: false,
};

const defaultProps = {
    firstName: { value: "Jane", onChangeText: vi.fn() },
    lastName: { value: "Doe", onChangeText: vi.fn() },
    birthDay: { selected: new Date(1990, 0, 1), onChange: vi.fn() },
    gender: { value: "female", onValueChange: vi.fn() },
    maleRadioButton: { value: "male" },
    femaleRadioButton: { value: "female" },
    countryCode: { value: "JP", onChangeText: vi.fn() },
    postalCode: { value: "100-0001", onChangeText: vi.fn() },
    saveButton: { onPress: vi.fn() },
    logoutButton: { onPress: vi.fn() },
};

describe("AccountScreenTemplate", () => {
    it("renders correctly with en-US locale", () => {
        const { toJSON } = renderWithProvider(
            <AccountScreenTemplate {...defaultProps} dimens={mobileDimens} locale="en-US" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders correctly with ja-JP locale", () => {
        const { toJSON } = renderWithProvider(
            <AccountScreenTemplate {...defaultProps} dimens={mobileDimens} locale="ja-JP" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("calls saveButton.onPress when save pressed", () => {
        const onPress = vi.fn();
        const { getByText } = renderWithProvider(
            <AccountScreenTemplate
                {...defaultProps}
                saveButton={{ onPress }}
                dimens={mobileDimens}
                locale="en-US"
            />,
        );
        fireEvent.press(getByText(/update/i));
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});
