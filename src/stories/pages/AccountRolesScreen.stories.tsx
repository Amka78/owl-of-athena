import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { AccountRolesScreen } from "../../components/pages/AccountRolesScreen";
import { Theme } from "../../constants";
import { renderAt } from "../support/deviceSize";

vi.mock("../../hooks", async () => {
    const { hooksMock } = await import("../support/deviceSize");
    return hooksMock({
        useCheckLogging: vi.fn(),
    });
});

vi.mock("../../store/authStore", () => ({
    useAuthStore: () => ({
        user: {
            id: "u1",
            email: "jane@example.com",
            roles: [
                { id: "r1", slug: "admin", title: "Admin" },
                { id: "r2", slug: "beta_tester", title: "Beta Tester" },
            ],
        },
        inactiveRoles: [],
        setInactiveRoles: vi.fn(),
    }),
}));

const meta = {
    title: "Pages/AccountRolesScreen",
    component: AccountRolesScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof AccountRolesScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
    render: renderAt("mobile", AccountRolesScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Tablet: Story = {
    render: renderAt("tablet", AccountRolesScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    render: renderAt("desktop", AccountRolesScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
