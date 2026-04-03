import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { DatePicker } from '../../components/molecules/DatePicker';

const meta = {
    title: 'Molecules/DatePicker',
    component: DatePicker,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        label: 'Select Date',
        selected: new Date('2024-01-15'),
        format: 'YYYY/MM/DD',
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
