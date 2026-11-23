import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { AdminMessagesScreen } from "../../components/pages/AdminMessagesScreen";
import { Theme } from "../../constants";
import { renderAt } from "../support/deviceSize";

// レンダーごとに新しい関数を返すと useEffect の依存が毎回変わり無限ループするため、
// モックはモジュールスコープで安定参照にする。
const adminMock = {
    loading: false,
    fetchIssues: async (): Promise<unknown[]> => [],
    fetchMessages: async (): Promise<unknown[]> => [
        {
            id: "m1",
            title: "Weekly digest",
            type: "info",
            platform: "all",
            read_count: 42,
            created_at: "2026-11-20T09:00:00Z",
        },
    ],
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

const meta = {
    title: "Pages/AdminMessagesScreen",
    component: AdminMessagesScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof AdminMessagesScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
    render: renderAt("mobile", AdminMessagesScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Tablet: Story = {
    render: renderAt("tablet", AdminMessagesScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    render: renderAt("desktop", AdminMessagesScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
