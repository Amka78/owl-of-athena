import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { View } from "react-native";
import { Provider } from "react-native-paper";
import { OptionSlider } from "../../components/molecules/OptionSlider";
import { Theme } from "../../constants";

const leftIcon = (props: any) => (
    <View style={props.style}>
        <MaterialCommunityIcons name="clock" size={24} color={props.color} />
    </View>
);

const meta = {
    title: "Molecules/OptionSlider",
    component: OptionSlider,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof OptionSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        title: "Delay (minutes)",
        description: "Set stimulation delay",
        left: leftIcon,
        disabled: false,
        value: 30,
        field: { type: "slider", format: "minutes", min: 0, max: 120, step: 5 },
        onValueChange: () => {},
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
