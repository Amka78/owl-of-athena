import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { SessionDesktopScreen } from "../../components/pages/SessionDesktopScreen";
import { SessionScreen } from "../../components/pages/SessionScreen";
import { Theme } from "../../constants";
import { FilterByDateValues } from "../../store/sessionStore";
import { renderAt } from "../support/deviceSize";

vi.mock("../../hooks/sessions/useSession", () => ({
    useSession: () => ({
        selectedSession: {},
        selectedSessionDetail: {},
        asleepAt: { hours: () => 22, minutes: () => 30 },
        awakeAt: { hours: () => 6, minutes: () => 0 },
        sleepDuration: { hours: 7, minutes: 30 },
        remDuration: { hours: 1, minutes: 45 },
        deepDuration: { hours: 2, minutes: 15 },
        radialProgress: 82,
        chartSelectButtonPress: vi.fn(),
        currentChart: "PieChart",
        scaleXDomain: [Date.now() - 3600000 * 8, Date.now()],
    }),
}));

// Desktop バリアントでは実アプリが表示する SessionDesktopScreen を描画するため、
// そちらが使う useSessinList もモックする。
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

vi.mock("../../hooks", async () => {
    const { hooksMock } = await import("../support/deviceSize");
    return hooksMock();
});

vi.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: vi.fn(), goBack: vi.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: vi.fn(),
}));

const meta = {
    title: "Pages/SessionScreen",
    component: SessionScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof SessionScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
    render: renderAt("mobile", SessionScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Tablet: Story = {
    render: renderAt("tablet", SessionScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

// 実アプリは isDesktop && isHorizontal のとき SessionDesktopScreen を表示するため、
// Desktop バリアントはそちらを描画する。
export const Desktop: Story = {
    render: renderAt("desktop", SessionDesktopScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
