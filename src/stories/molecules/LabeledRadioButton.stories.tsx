import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider, RadioButton } from "react-native-paper";
import { LabeledRadioButton } from "../../components/molecules/LabeledRadioButton";
import { Theme } from "../../constants";

const meta = {
    title: "Molecules/LabeledRadioButton",
    component: LabeledRadioButton,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <RadioButton.Group value="option1" onValueChange={() => {}}>
                    <Story />
                </RadioButton.Group>
            </Provider>
        ),
    ],
    argTypes: {
        radioButtonColor: { control: "color" },
        radioButtonUncheckedColor: { control: "color" },
    },
} satisfies Meta<typeof LabeledRadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        value: "option1",
        label: "Option 1",
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
