import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Provider } from "react-native-paper";
import { expect } from "storybook/test";
import { vi } from "vitest";
import { DeviceScreen } from "../../components/pages/DeviceScreen";
import { Theme } from "../../constants";
import { renderAt } from "../support/deviceSize";

vi.mock("../../hooks/useDeviceInfo", () => ({
    useDeviceInfo: () => ({
        version: "2.1.0",
        bootloaderVersion: "1.0.0",
        bleVersion: "1.2.0",
        bootstrapVersion: "1.0.0",
        batteryLevel: 85,
        buildDate: 1710000000000,
        runningTime: "3h 12m",
        bytesFree: 10485760,
    }),
}));

vi.mock("../../hooks/useDeviceMaintenance", () => ({
    useDeviceMaintenance: () => ({
        connected: true,
        busy: false,
        onFormatSdCardPress: vi.fn(),
        onResetDevicePress: vi.fn(),
    }),
}));

vi.mock("../../hooks", async () => {
    const { hooksMock } = await import("../support/deviceSize");
    return hooksMock();
});

const meta = {
    title: "Pages/DeviceScreen",
    component: DeviceScreen,
    tags: ["autodocs"],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof DeviceScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
    render: renderAt("mobile", DeviceScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Tablet: Story = {
    render: renderAt("tablet", DeviceScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    render: renderAt("desktop", DeviceScreen),
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
