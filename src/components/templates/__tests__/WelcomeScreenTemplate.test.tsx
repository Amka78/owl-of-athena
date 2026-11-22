import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { StyleSheet } from "react-native";
import { Provider } from "react-native-paper";
import { Message, MessageKeys, Theme } from "../../../constants";
import { WelcomeScreenTemplate } from "../WelcomeScreenTemplate";

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

const desktopDimens = {
    fontScale: 1,
    scale: 1,
    height: 1200,
    width: 1400,
    isDesktop: true,
    isLargeWidth: true,
    isSmallHeight: false,
    isVertical: false,
    isHorizontal: true,
};

describe("WelcomeScreenTemplate", () => {
    it("renders correctly with en-US locale", () => {
        const { toJSON } = renderWithProvider(
            <WelcomeScreenTemplate
                onLoginPress={vi.fn()}
                onSignupPress={vi.fn()}
                onStandalonePress={vi.fn()}
                dimens={mobileDimens}
                locale="en-US"
            />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders correctly with ja-JP locale", () => {
        const { toJSON } = renderWithProvider(
            <WelcomeScreenTemplate
                onLoginPress={vi.fn()}
                onSignupPress={vi.fn()}
                onStandalonePress={vi.fn()}
                dimens={mobileDimens}
                locale="ja-JP"
            />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders correctly in desktop mode", () => {
        const { toJSON } = renderWithProvider(
            <WelcomeScreenTemplate
                onLoginPress={vi.fn()}
                onSignupPress={vi.fn()}
                onStandalonePress={vi.fn()}
                dimens={desktopDimens}
                locale="en-US"
            />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("calls onLoginPress when login button pressed", () => {
        const onLoginPress = vi.fn();
        const { getByText } = renderWithProvider(
            <WelcomeScreenTemplate
                onLoginPress={onLoginPress}
                onSignupPress={vi.fn()}
                onStandalonePress={vi.fn()}
                dimens={mobileDimens}
                locale="en-US"
            />,
        );
        fireEvent.press(getByText(/log in/i));
        expect(onLoginPress).toHaveBeenCalledTimes(1);
    });

    it("centers the title and the body text", () => {
        const { getByText } = renderWithProvider(
            <WelcomeScreenTemplate
                onLoginPress={vi.fn()}
                onSignupPress={vi.fn()}
                onStandalonePress={vi.fn()}
                dimens={mobileDimens}
                locale="ja-JP"
            />,
        );
        const titleStyle = StyleSheet.flatten(
            getByText(Message.get(MessageKeys.welcome_title)).props.style,
        );
        expect(titleStyle.textAlign).toBe("center");
        const bodyStyle = StyleSheet.flatten(
            getByText(Message.get(MessageKeys.welcome_text)).props.style,
        );
        expect(bodyStyle.textAlign).toBe("center");
    });
});
