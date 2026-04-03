import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { SignupScreenTemplate } from '../../components/templates/SignupScreenTemplate';

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

const textBoxProps = { value: '', onChangeText: fn() };
const checkBoxProps = { status: 'unchecked' as const, onPress: fn(), onLabelPress: fn() };

const meta = {
    title: 'Templates/SignupScreenTemplate',
    component: SignupScreenTemplate,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof SignupScreenTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnUSLocale: Story = {
    args: {
        emailTextBox: textBoxProps,
        passwordTextBox: textBoxProps,
        passwordConfirmTextBox: textBoxProps,
        labeledCheckBox: checkBoxProps,
        onSignupPress: fn(),
        onCancelPress: fn(),
        dimens: mobileDimens,
        locale: 'en-US',
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const JaJPLocale: Story = {
    args: {
        emailTextBox: textBoxProps,
        passwordTextBox: textBoxProps,
        passwordConfirmTextBox: textBoxProps,
        labeledCheckBox: checkBoxProps,
        onSignupPress: fn(),
        onCancelPress: fn(),
        dimens: mobileDimens,
        locale: 'ja-JP',
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    args: {
        emailTextBox: textBoxProps,
        passwordTextBox: textBoxProps,
        passwordConfirmTextBox: textBoxProps,
        labeledCheckBox: checkBoxProps,
        onSignupPress: fn(),
        onCancelPress: fn(),
        dimens: desktopDimens,
        locale: 'en-US',
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
