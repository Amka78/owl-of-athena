import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Colors, Message, MessageKeys, Theme } from '../../../constants';
import { LoginScreenTemplate } from '../LoginScreenTemplate';


const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

// StyleSheet.flatten はこのテスト環境では paper の配列を深くマージしないため、
// 要素順（後勝ち）を保証するマージで実効スタイルを取り出す。
const mergedStyle = (styles: unknown): Record<string, unknown> => {
    const out: Record<string, unknown> = {};
    const walk = (value: unknown): void => {
        if (Array.isArray(value)) {
            for (const item of value) walk(item);
        } else if (value !== null && typeof value === 'object') {
            for (const key of Object.keys(value)) out[key] = (value as Record<string, unknown>)[key];
        }
    };
    walk(styles);
    return out;
};

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

const defaultProps = {
    email: { value: '', onChangeText: jest.fn() },
    password: { value: '', onChangeText: jest.fn() },
    errorText: { children: '' },
    loginButton: { onPress: jest.fn() },
    cancelButton: { onPress: jest.fn() },
    forgotPasswordButton: { onPress: jest.fn() },
    signupButton: { onPress: jest.fn() },
};

describe('LoginScreenTemplate', () => {
    it('renders correctly with en-US locale', () => {
        const { toJSON } = renderWithProvider(
            <LoginScreenTemplate {...defaultProps} dimens={mobileDimens} locale="en-US" />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly with ja-JP locale', () => {
        const { toJSON } = renderWithProvider(
            <LoginScreenTemplate {...defaultProps} dimens={mobileDimens} locale="ja-JP" />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders in desktop mode', () => {
        const { toJSON } = renderWithProvider(
            <LoginScreenTemplate {...defaultProps} dimens={desktopDimens} locale="en-US" />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('calls loginButton.onPress when login pressed', () => {
        const onPress = jest.fn();
        const { getByText } = renderWithProvider(
            <LoginScreenTemplate
                {...defaultProps}
                loginButton={{ onPress }}
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        fireEvent.press(getByText(/log in/i));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('renders the link labels in cyan for the navy background', () => {
        const { getByText } = renderWithProvider(
            <LoginScreenTemplate {...defaultProps} dimens={mobileDimens} locale="ja-JP" />
        );
        const forgotPasswordStyle = mergedStyle(
            getByText(Message.get(MessageKeys.login_forgot_password_button)).props.style
        );
        expect(forgotPasswordStyle.color).toBe(Colors.cyan);
        const signupStyle = mergedStyle(
            getByText(Message.get(MessageKeys.login_no_account_button)).props.style
        );
        expect(signupStyle.color).toBe(Colors.cyan);
    });
});
