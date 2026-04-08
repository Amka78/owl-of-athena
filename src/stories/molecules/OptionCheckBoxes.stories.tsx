import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { View } from "react-native";
import { Provider } from "react-native-paper";
import { OptionCheckBoxes } from "../../components/molecules/OptionCheckBoxes";
import { Theme } from "../../constants";

const leftIcon = (props: any) => (
    <View style={props.style}>
        <MaterialCommunityIcons name="filter" size={24} color={props.color} />
    </View>
);

const meta = {
    title: "Molecules/OptionCheckBoxes",
    component: OptionCheckBoxes,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof OptionCheckBoxes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        title: "File Streams",
        description: "Select data streams to record",
        left: leftIcon,
        disabled: false,
        value: 0,
        field: { type: "checkboxes", choices: "", labelNone: "None" },
        onValueChange: () => {},
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
