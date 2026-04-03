import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, within } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { ProfileListMenu } from '../../components/organisms/profiles/ProfileListMenu';

const meta = {
    title: 'Organisms/ProfileListMenu',
    component: ProfileListMenu,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ProfileListMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        showOfficialCheckBoxStatus: 'checked',
        onShowOfficialCheckBoxPress: fn(),
        showCommunityCheckBoxStatus: 'unchecked',
        onShowCommunityCheckBoxPress: fn(),
        showPrivateCheckBoxStatus: 'indeterminate',
        onShowPrivateCheckBoxPress: fn(),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};

export const AllChecked: Story = {
    args: {
        showOfficialCheckBoxStatus: 'checked',
        onShowOfficialCheckBoxPress: fn(),
        showCommunityCheckBoxStatus: 'checked',
        onShowCommunityCheckBoxPress: fn(),
        showPrivateCheckBoxStatus: 'checked',
        onShowPrivateCheckBoxPress: fn(),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};
