import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { AdminSessionsScreen } from "../../components/pages/AdminSessionsScreen";
import { Theme } from "../../constants";
import { renderAt } from "../support/deviceSize";

// AdminTable の dataSource は Supabase 通信を担うため、story では空データを返すスタブにする。
vi.mock("../../services/AdminQueryService", () => ({
    createSupabaseAdminDataSource: () => ({
        fetchPage: async () => ({ rows: [], total: 0 }),
        fetchAll: async () => [],
    }),
}));

vi.mock("../../components/molecules/AdminTableColumnPrefs", () => ({
    loadHiddenColumns: async () => undefined,
    saveHiddenColumns: async () => undefined,
}));

// ダウンロード処理用の REST クライアントは story では未使用のためモックする。
vi.mock("../../clients/SessionRestClient", () => ({
    default: {
        getById: async () => ({}),
        getDetailsById: async () => ({}),
    },
}));

vi.mock("../../hooks", async () => {
    const { hooksMock } = await import("../support/deviceSize");
    return hooksMock();
});

const meta = {
    title: "Pages/AdminSessionsScreen",
    component: AdminSessionsScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof AdminSessionsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
    render: renderAt("mobile", AdminSessionsScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Tablet: Story = {
    render: renderAt("tablet", AdminSessionsScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    render: renderAt("desktop", AdminSessionsScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
