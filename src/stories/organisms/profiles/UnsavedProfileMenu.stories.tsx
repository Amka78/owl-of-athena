import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { UnsavedProfileMenu } from "../../../components/organisms/profiles/UnsavedProfileMenu";
import { getDimensions } from "../../WindowDimensionsForStoryBook";

const meta = {
    title: "Organisms/UnsavedProfileMenu",
    component: UnsavedProfileMenu,
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof UnsavedProfileMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        isUserProfile: true,
        dimens: getDimensions(),
        onSaveAsNewPress: fn(),
        onOverwriteSavePress: fn(),
        onCancelPress: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
