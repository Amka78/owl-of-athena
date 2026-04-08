import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { UnsavedProfileMenu } from "../../components/organisms/profiles/UnsavedProfileMenu";
import { Theme } from "../../constants";

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

const meta = {
    title: "Organisms/UnsavedProfileMenu",
    component: UnsavedProfileMenu,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof UnsavedProfileMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UserProfile: Story = {
    args: {
        isUserProfile: true,
        dimens: mobileDimens,
        onSaveAsNewPress: fn(),
        onOverwriteSavePress: fn(),
        onCancelPress: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const NonUserProfile: Story = {
    args: {
        isUserProfile: false,
        dimens: mobileDimens,
        onSaveAsNewPress: fn(),
        onOverwriteSavePress: fn(),
        onCancelPress: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
