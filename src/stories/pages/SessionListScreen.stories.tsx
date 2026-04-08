import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";
import { SessionListScreen } from "../../components/pages/SessionListScreen";
import { Theme } from "../../constants";
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
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
        setOptions: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
}));

const meta = {
    title: "Pages/SessionListScreen",
    component: SessionListScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof SessionListScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
