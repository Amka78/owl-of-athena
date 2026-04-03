import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../constants";
import { FlexSpacer } from "../../components/atoms/FlexSpacer";

const meta = {
    title: "Atoms/FlexSpacer",
    component: FlexSpacer,
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof FlexSpacer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {},
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

