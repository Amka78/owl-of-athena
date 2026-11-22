import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { SessionDesktopScreen } from "../../components/pages/SessionDesktopScreen";
import { Theme } from "../../constants";
import { FilterByDateValues } from "../../store/sessionStore";

vi.mock("../../hooks/sessions/useSessionList", () => ({
    useSessinList: () => ({
        showFilter: false,
        filterCondition: {
            byDate: FilterByDateValues.ANY_TIME,
            showNotes: false,
            showStarred: false,
        },
        onFilterPress: vi.fn(),
        onRefreshPress: vi.fn(),
        list: [],
        onSelectSession: vi.fn(),
        onDeleteSession: vi.fn(),
        onStarPress: vi.fn(),
        onNotePress: vi.fn(),
        userId: "guest",
    }),
}));

vi.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: vi.fn(), goBack: vi.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: vi.fn(),
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
