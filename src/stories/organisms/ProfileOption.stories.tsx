import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, within } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme, MessageKeys } from '../../constants';
import { ProfileOption } from '../../components/organisms/profiles/ProfileOption';

const toggleOption = {
    name: 'stim-enabled' as const,
    title: 'REM Stimulation',
    description: 'Enables REM stimulation when detected.',
    group: 'REM Stim Options' as const,
    groupName: MessageKeys.profile_rem_stim_options,
    value: false,
    field: { type: 'toggle' as const },
};

const meta = {
    title: 'Organisms/ProfileOption',
    component: ProfileOption,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof ProfileOption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Toggle: Story = {
    args: {
        profileOption: toggleOption,
        failed: false,
        onHelpIconPress: fn(),
        onValueChange: fn(),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};

export const Failed: Story = {
    args: {
        profileOption: {
            ...toggleOption,
            failedConditionMessage: 'Requires firmware >= 2.0',
        },
        failed: true,
        onHelpIconPress: fn(),
        onValueChange: fn(),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};
