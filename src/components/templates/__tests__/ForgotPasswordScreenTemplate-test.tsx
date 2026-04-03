import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { ForgotPasswordScreenTemplate } from '../ForgotPasswordScreenTemplate';

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

const defaultProps = {
    emailAddress: { value: '', onChangeText: jest.fn(), set: jest.fn() },
    errorText: { children: '' },
    forgotPasswordButton: { onPress: jest.fn() },
    cancelButton: { onPress: jest.fn() },
};

describe('ForgotPasswordScreenTemplate', () => {
    it('renders correctly with en-US locale', () => {
        const { toJSON } = renderWithProvider(
            <ForgotPasswordScreenTemplate {...defaultProps} dimens={mobileDimens} locale="en-US" />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly with ja-JP locale', () => {
        const { toJSON } = renderWithProvider(
            <ForgotPasswordScreenTemplate {...defaultProps} dimens={mobileDimens} locale="ja-JP" />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('calls forgotPasswordButton.onPress when submit pressed', () => {
        const onPress = jest.fn();
        const { getByText } = renderWithProvider(
            <ForgotPasswordScreenTemplate
                {...defaultProps}
                forgotPasswordButton={{ onPress }}
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        fireEvent.press(getByText(/request reset/i));
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});
