import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Text } from "react-native";
import { Provider } from "react-native-paper";
import { ConvertibleListForm } from "../../components/molecules/ConvertibleListForm";
import { Theme } from "../../constants";

const meta = {
    title: "Molecules/ConvertibleListForm",
    component: ConvertibleListForm,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ConvertibleListForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        listMenu: [<Text key="1">Menu Item</Text>],
        listScreen: <Text>List Screen Content</Text>,
        itemScreen: <Text>Item Screen Content</Text>,
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
