import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { ForgotPasswordScreenTemplate } from "../../components/templates/ForgotPasswordScreenTemplate";
import { Theme } from "../../constants";

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

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

const defaultArgs = {
    emailAddress: { value: "", onChangeText: fn(), set: fn() },
    errorText: { children: "" },
    forgotPasswordButton: { onPress: fn() },
    cancelButton: { onPress: fn() },
};

const meta = {
    title: "Templates/ForgotPasswordScreenTemplate",
    component: ForgotPasswordScreenTemplate,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ForgotPasswordScreenTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnUSLocale: Story = {
    args: { ...defaultArgs, dimens: mobileDimens, locale: "en-US" },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const JaJPLocale: Story = {
    args: { ...defaultArgs, dimens: mobileDimens, locale: "ja-JP" },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    args: { ...defaultArgs, dimens: desktopDimens, locale: "en-US" },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
