import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { ProfileOptionList } from "../../../components/organisms/profiles/ProfileOptionList";
import { Theme } from "../../../constants";
import { defaultOptions, groupingProfileOptionList } from "../../../services/ProfileService";

const meta = {
    title: "Organisms/ProfileOptionList",
    component: ProfileOptionList,
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

const groupedOptionList = groupingProfileOptionList(defaultOptions);

export const EnUSLocale: Story = {
    args: {
        locale: "en-US",
        groupedOptionList,
        style: {},
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const JaJPLocale: Story = {
    args: {
        locale: "ja-JP",
        groupedOptionList,
        style: {},
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
