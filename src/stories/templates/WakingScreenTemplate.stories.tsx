import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { WakingScreenTemplate } from "../../components/templates/WakingScreenTemplate";
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

const meta = {
    title: "Templates/WakingScreenTemplate",
    component: WakingScreenTemplate,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof WakingScreenTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnUSLocale: Story = {
    args: {
        timeView: { hours: 6, minutes: 30 },
        onWakeupPress: fn(),
        dimens: mobileDimens,
        locale: "en-US",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const JaJPLocale: Story = {
    args: {
        timeView: { hours: 6, minutes: 30 },
        onWakeupPress: fn(),
        dimens: mobileDimens,
        locale: "ja-JP",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    args: {
        timeView: { hours: 6, minutes: 30 },
        onWakeupPress: fn(),
        dimens: desktopDimens,
        locale: "en-US",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
