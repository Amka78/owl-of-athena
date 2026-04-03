import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { OptionLedEffect } from '../../components/molecules/OptionLedEffect';

const leftIcon = (props: any) => (
    <View style={props.style}>
        <MaterialCommunityIcons name="led-on" size={24} color={props.color} />
    </View>
);

const meta = {
    title: 'Molecules/OptionLedEffect',
    component: OptionLedEffect,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof OptionLedEffect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        title: 'LED Effect',
        description: 'Choose the LED lighting effect',
        left: leftIcon,
        disabled: false,
        value: 'blink',
        field: { type: 'toggle', valueEnabled: 'blink', valueDisabled: '' },
        onValueChange: () => {},
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};
