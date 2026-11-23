import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { AdminAppSettingsScreen } from "../../components/pages/AdminAppSettingsScreen";
import { Theme } from "../../constants";
import { renderAt } from "../support/deviceSize";

vi.mock("../../hooks/useAdmin", () => ({
    useAdmin: () => ({
        loading: false,
        fetchIssues: async () => [],
        fetchMessages: async () => [],
        apiBaseUrl: "https://api.iwinks.org",
        setApiBaseUrl: vi.fn(),
    }),
}));

vi.mock("../../hooks", async () => {
    const { hooksMock } = await import("../support/deviceSize");
    return hooksMock();
});

const meta = {
    title: "Pages/AdminAppSettingsScreen",
    component: AdminAppSettingsScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof AdminAppSettingsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
    render: renderAt("mobile", AdminAppSettingsScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Tablet: Story = {
    render: renderAt("tablet", AdminAppSettingsScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    render: renderAt("desktop", AdminAppSettingsScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
