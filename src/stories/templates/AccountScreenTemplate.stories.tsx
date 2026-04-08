import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { AccountScreenTemplate } from "../../components/templates/AccountScreenTemplate";
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
    firstName: { value: "Jane", onChangeText: fn() },
    lastName: { value: "Doe", onChangeText: fn() },
    birthDay: { selected: new Date(1990, 0, 1), onChange: fn() },
    gender: { value: "female", onValueChange: fn() },
    maleRadioButton: { value: "male" },
    femaleRadioButton: { value: "female" },
    saveButton: { onPress: fn() },
    logoutButton: { onPress: fn() },
};

const meta = {
    title: "Templates/AccountScreenTemplate",
    component: AccountScreenTemplate,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof AccountScreenTemplate>;

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
