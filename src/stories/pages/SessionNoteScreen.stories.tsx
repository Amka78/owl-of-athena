import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../constants";
import { SessionNoteScreen } from "../../components/pages/SessionNoteScreen";

jest.mock("../../hooks/sessions/useSessionNote", () => ({
    useSessionNote: () => ({
        onBlur: jest.fn(),
        onChangeText: jest.fn(),
        notes: "Great sleep tonight! Felt rested.",
    }),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
}));


const meta = {
    title: "Pages/SessionNoteScreen",
    component: SessionNoteScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof SessionNoteScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
