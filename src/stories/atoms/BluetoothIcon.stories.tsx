import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { BluetoothIcon } from "../../components/atoms/BluetoothIcon";
import { ConnectionStates } from "../../sdk/AuroraConstants";

const meta = {
    title: "Atoms/BluetoothIcon",
    component: BluetoothIcon,
    tags: ["autodocs"],
} satisfies Meta<typeof BluetoothIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        connectionStates: ConnectionStates.CONNECTED,
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Disconnected: Story = {
    args: {
        connectionStates: ConnectionStates.DISCONNECTED,
    },
};

export const Busy: Story = {
    args: {
        connectionStates: ConnectionStates.BUSY,
    },
};
