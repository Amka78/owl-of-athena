import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { LoginScreenTemplate } from '../LoginScreenTemplate';

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn(), setOptions: jest.fn() }),
}));

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

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
});
