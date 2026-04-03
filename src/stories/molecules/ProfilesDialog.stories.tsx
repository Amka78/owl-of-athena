import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import React from 'react';
import { Provider, RadioButton } from 'react-native-paper';
import { Theme } from '../../constants';
import { ProfilesDialog } from '../../components/molecules/ProfilesDialog';

const meta = {
    title: 'Molecules/ProfilesDialog',
    component: ProfilesDialog,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof ProfilesDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {},
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};
