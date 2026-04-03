import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, within } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { SettingsScreenTemplate } from '../../components/templates/SettingsScreenTemplate';

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

const mobileDimens = {
    fontScale: 1, scale: 1, height: 800, width: 400,
    isDesktop: false, isLargeWidth: false, isSmallHeight: false,
    isVertical: true, isHorizontal: false,
};

const desktopDimens = {
    fontScale: 1, scale: 1, height: 1200, width: 1400,
    isDesktop: true, isLargeWidth: true, isSmallHeight: false,
    isVertical: false, isHorizontal: true,
};

const defaultArgs = {
    inlineTimePicker: { hours: 7, minutes: 30, onPress: fn() },
    smartAlarmAudioMenu: { onPress: fn(), value: 'birds' },
    profileMenu: { onPress: fn(), value: 'default', hasProfiles: false },
    smartAlarmEnabled: { status: 'checked' as const, onPress: fn() },
    dslEnabled: { status: 'unchecked' as const, onPress: fn() },
    remStimEnabled: { status: 'unchecked' as const, onPress: fn() },
    remStimAudioMenu: { onPress: fn(), value: 'birds' },
    saveButton: { onPress: fn() },
    cancelButton: { onPress: fn() },
};

const meta = {
    title: 'Templates/SettingsScreenTemplate',
    component: SettingsScreenTemplate,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof SettingsScreenTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnUSLocale: Story = {
    args: { ...defaultArgs, dimens: mobileDimens, locale: 'en-US' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};

export const JaJPLocale: Story = {
    args: { ...defaultArgs, dimens: mobileDimens, locale: 'ja-JP' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    args: { ...defaultArgs, dimens: desktopDimens, locale: 'en-US' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};

export const WithProfiles: Story = {
    args: {
        ...defaultArgs,
        profileMenu: { onPress: fn(), value: 'default', hasProfiles: true },
        dimens: mobileDimens,
        locale: 'en-US',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};
