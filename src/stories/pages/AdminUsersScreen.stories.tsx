import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { AdminUsersScreen } from "../../components/pages/AdminUsersScreen";
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

vi.mock("../../hooks", async () => {
    const { hooksMock } = await import("../support/deviceSize");
    return hooksMock();
});

const meta = {
    title: "Pages/AdminUsersScreen",
    component: AdminUsersScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof AdminUsersScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
    render: renderAt("mobile", AdminUsersScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Tablet: Story = {
    render: renderAt("tablet", AdminUsersScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    render: renderAt("desktop", AdminUsersScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
