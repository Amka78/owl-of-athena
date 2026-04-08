import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { ProfileSecondMenu } from "../../../components/organisms/profiles/ProfileSecondMenu";
import { Theme } from "../../../constants";
import { getDimensions } from "../../WindowDimensionsForStoryBook";

const meta = {
    title: "Organisms/ProfileSecondMenu",
    component: ProfileSecondMenu,
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

export const Primary: Story = {
    args: {
        auroraConnected: false,
        selectedProfileHasUnsavedChanges: false,
        dimens: getDimensions(),
        onSaveToAuroraPress: fn(),
        onShowAdvancedOptionsPress: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
