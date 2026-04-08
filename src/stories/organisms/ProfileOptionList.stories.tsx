import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { ProfileOptionList } from "../../components/organisms/profiles/ProfileOptionList";
import { Theme } from "../../constants";
import { defaultOptions, groupingProfileOptionList } from "../../services/ProfileService";

const groupedOptionList = groupingProfileOptionList(defaultOptions);

const meta = {
    title: "Organisms/ProfileOptionList",
    component: ProfileOptionList,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ProfileOptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnUSLocale: Story = {
    args: {
        groupedOptionList,
        locale: "en-US",
        style: { flex: 1 },
        onHelpIconPress: fn(),
        onValueChange: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const JaJPLocale: Story = {
    args: {
        groupedOptionList,
        locale: "ja-JP",
        style: { flex: 1 },
        onHelpIconPress: fn(),
        onValueChange: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
