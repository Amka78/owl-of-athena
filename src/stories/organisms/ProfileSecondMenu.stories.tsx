import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { ProfileSecondMenu } from "../../components/organisms/profiles/ProfileSecondMenu";
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
    title: "Organisms/ProfileSecondMenu",
    component: ProfileSecondMenu,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ProfileSecondMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Connected: Story = {
    args: {
        auroraConnected: true,
        selectedProfileHasUnsavedChanges: false,
        dimens: mobileDimens,
        onSaveToAuroraPress: fn(),
        onShowAdvancedOptionsPress: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Disconnected: Story = {
    args: {
        auroraConnected: false,
        selectedProfileHasUnsavedChanges: true,
        dimens: mobileDimens,
        onSaveToAuroraPress: fn(),
        onShowAdvancedOptionsPress: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
