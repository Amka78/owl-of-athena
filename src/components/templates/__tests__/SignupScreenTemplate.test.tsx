import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { SignupScreenTemplate } from '../SignupScreenTemplate';

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const mobileDimens = {
    fontScale: 1, scale: 1, height: 800, width: 400,
    isDesktop: false, isLargeWidth: false, isSmallHeight: false,
    isVertical: true, isHorizontal: false,
};

const textBoxProps = { value: '', onChangeText: jest.fn() };
const checkBoxProps = { status: 'unchecked' as const, onPress: jest.fn(), onLabelPress: jest.fn() };

describe('SignupScreenTemplate', () => {
    it('renders correctly with en-US locale', () => {
        const { toJSON } = renderWithProvider(
            <SignupScreenTemplate
                emailTextBox={textBoxProps}
                passwordTextBox={textBoxProps}
                passwordConfirmTextBox={textBoxProps}
                labeledCheckBox={checkBoxProps}
                onSignupPress={jest.fn()}
                onCancelPress={jest.fn()}
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly with ja-JP locale', () => {
        const { toJSON } = renderWithProvider(
            <SignupScreenTemplate
                emailTextBox={textBoxProps}
                passwordTextBox={textBoxProps}
                passwordConfirmTextBox={textBoxProps}
                labeledCheckBox={checkBoxProps}
                onSignupPress={jest.fn()}
                onCancelPress={jest.fn()}
                dimens={mobileDimens}
                locale="ja-JP"
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('calls onSignupPress when signup button pressed', () => {
        const onSignupPress = jest.fn();
        const { getByText } = renderWithProvider(
            <SignupScreenTemplate
                emailTextBox={textBoxProps}
                passwordTextBox={textBoxProps}
                passwordConfirmTextBox={textBoxProps}
                labeledCheckBox={checkBoxProps}
                onSignupPress={onSignupPress}
                onCancelPress={jest.fn()}
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        fireEvent.press(getByText(/sign up/i));
        expect(onSignupPress).toHaveBeenCalledTimes(1);
    });

    it('shows error text when provided', () => {
        const { getAllByText } = renderWithProvider(
            <SignupScreenTemplate
                emailTextBox={textBoxProps}
                passwordTextBox={textBoxProps}
                passwordConfirmTextBox={textBoxProps}
                labeledCheckBox={checkBoxProps}
                onSignupPress={jest.fn()}
                onCancelPress={jest.fn()}
                errorText="Email is invalid"
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        expect(getAllByText('Email is invalid').length).toBeGreaterThan(0);
    });
});
