import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { OptionToggle } from '../../components/molecules/OptionToggle';

const leftIcon = (props: any) => (
    <View style={props.style}>
        <MaterialCommunityIcons name="bell" size={24} color={props.color} />
    </View>
);

const meta = {
    title: 'Molecules/OptionToggle',
    component: OptionToggle,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof OptionToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Enabled: Story = {
    args: {
        title: 'Enable Notifications',
        description: 'Receive alerts on your device',
        left: leftIcon,
        disabled: false,
        value: 'enabled',
        field: { type: 'toggle', valueEnabled: 'enabled', valueDisabled: 'disabled' },
        onValueChange: () => {},
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};

export const Disabled: Story = {
    args: {
        title: 'Enable Notifications',
        description: 'Receive alerts on your device',
        left: leftIcon,
        disabled: true,
        value: 'disabled',
        field: { type: 'toggle', valueEnabled: 'enabled', valueDisabled: 'disabled' },
        onValueChange: () => {},
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};
