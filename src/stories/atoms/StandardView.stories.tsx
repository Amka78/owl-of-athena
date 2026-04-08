import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import type React from "react";
import { Text } from "react-native";
import { Provider } from "react-native-paper";
import { StandardView } from "../../components/atoms/StandardView";
import { Theme } from "../../constants";

const meta = {
    title: "Atoms/StandardView",
    component: StandardView,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof StandardView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: { children: undefined as unknown as React.ReactNode },
    render: (args) => (
        <StandardView {...args}>
            <Text>Content</Text>
        </StandardView>
    ),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
