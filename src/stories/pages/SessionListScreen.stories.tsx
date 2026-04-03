import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../constants";
import { SessionListScreen } from "../../components/pages/SessionListScreen";
import { FilterByDateValues } from "../../state/SessionState";

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

jest.mock("react-redux", () => ({
    useSelector: jest.fn(() => ({})),
    useDispatch: () => jest.fn(),
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
