import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import React from 'react';
import { Text } from 'react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { ConvertibleListForm } from '../../components/molecules/ConvertibleListForm';

const meta = {
    title: 'Molecules/ConvertibleListForm',
    component: ConvertibleListForm,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof ConvertibleListForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        listMenu: [<Text key="1">Menu Item</Text>],
        listScreen: <Text>List Screen Content</Text>,
        itemScreen: <Text>Item Screen Content</Text>,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};
