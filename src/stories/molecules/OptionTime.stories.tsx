import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { OptionTime } from '../../components/molecules/OptionTime';

const leftIcon = (props: any) => (
    <View style={props.style}>
        <MaterialCommunityIcons name="alarm" size={24} color={props.color} />
    </View>
);

const meta = {
    title: 'Molecules/OptionTime',
    component: OptionTime,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof OptionTime>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        title: 'Wake-up Time',
        description: 'Set the time you want to wake up',
        left: leftIcon,
        disabled: false,
        value: '07:30',
        field: { type: 'time', clearable: true, labelCleared: 'Not set', minutesStep: 5, defaultTime: 0 },
        onValueChange: () => {},
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
