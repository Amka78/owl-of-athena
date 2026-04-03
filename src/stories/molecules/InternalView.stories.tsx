import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import React from 'react';
import { Text } from 'react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { InternalView } from '../../components/molecules/InternalView';

const meta = {
    title: 'Molecules/InternalView',
    component: InternalView,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof InternalView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        children: <Text>Internal content</Text>,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};
