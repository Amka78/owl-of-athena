import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../constants";
import { SessionDesktopScreen } from "../../components/pages/SessionDesktopScreen";
import { FilterByDateValues } from "../../store/sessionStore";

jest.mock("../../hooks/sessions/useSessionList", () => ({
    useSessinList: () => ({
        showFilter: false,
        filterCondition: {
            byDate: FilterByDateValues.ANY_TIME,
            showNotes: false,
            showStarred: false,
        },
        onFilterPress: jest.fn(),
        onRefreshPress: jest.fn(),
        list: [],
        onSelectSession: jest.fn(),
        onDeleteSession: jest.fn(),
        onStarPress: jest.fn(),
        onNotePress: jest.fn(),
        userId: "guest",
    }),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
}));


const meta = {
    title: "Pages/SessionDesktopScreen",
    component: SessionDesktopScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof SessionDesktopScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
