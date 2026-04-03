import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { AccountScreenTemplate } from '../AccountScreenTemplate';

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
    firstName: { value: 'Jane', onChangeText: jest.fn() },
    lastName: { value: 'Doe', onChangeText: jest.fn() },
    birthDay: { selected: new Date(1990, 0, 1), onChange: jest.fn() },
    gender: { value: 'female', onValueChange: jest.fn() },
    maleRadioButton: { value: 'male' },
    femaleRadioButton: { value: 'female' },
    saveButton: { onPress: jest.fn() },
    logoutButton: { onPress: jest.fn() },
};

describe('AccountScreenTemplate', () => {
    it('renders correctly with en-US locale', () => {
        const { toJSON } = renderWithProvider(
            <AccountScreenTemplate {...defaultProps} dimens={mobileDimens} locale="en-US" />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly with ja-JP locale', () => {
        const { toJSON } = renderWithProvider(
            <AccountScreenTemplate {...defaultProps} dimens={mobileDimens} locale="ja-JP" />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('calls saveButton.onPress when save pressed', () => {
        const onPress = jest.fn();
        const { getByText } = renderWithProvider(
            <AccountScreenTemplate
                {...defaultProps}
                saveButton={{ onPress }}
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        fireEvent.press(getByText(/update/i));
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});
