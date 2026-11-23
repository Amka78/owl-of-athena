import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { AdminIssuesScreen } from "../../components/pages/AdminIssuesScreen";
import { Theme } from "../../constants";
import { renderAt } from "../support/deviceSize";

// レンダーごとに新しい関数を返すと useEffect の依存が毎回変わり無限ループするため、
// モックはモジュールスコープで安定参照にする。
const adminMock = {
    loading: false,
    fetchIssues: async (): Promise<unknown[]> => [
        {
            id: "i1",
            title: "BLE connection drops after 30 minutes",
            platform: "android",
            version: "1.0.7",
            critical: false,
            status: "open",
            logs: "[BLE] disconnected\n[BLE] reconnect attempt 1",
        },
    ],
    fetchMessages: async (): Promise<unknown[]> => [],
    apiBaseUrl: "https://api.iwinks.org",
    setApiBaseUrl: vi.fn(),
};

vi.mock("../../hooks/useAdmin", () => ({
    useAdmin: () => adminMock,
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
    title: "Pages/AdminIssuesScreen",
    component: AdminIssuesScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof AdminIssuesScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
    render: renderAt("mobile", AdminIssuesScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Tablet: Story = {
    render: renderAt("tablet", AdminIssuesScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    render: renderAt("desktop", AdminIssuesScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
