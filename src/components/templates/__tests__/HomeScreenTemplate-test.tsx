import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { HomeScreenTemplate } from '../HomeScreenTemplate';

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
    timeViewField: { onPress: jest.fn() },
    timeView: { hours: 7, minutes: 30 },
    profileButton: { onPress: jest.fn() },
    errorText: { children: '' },
    goToSleepButton: { onPress: jest.fn() },
};

describe('HomeScreenTemplate', () => {
    it('renders correctly with en-US locale', () => {
        const { toJSON } = renderWithProvider(
            <HomeScreenTemplate {...defaultProps} dimens={mobileDimens} locale="en-US" />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly with ja-JP locale', () => {
        const { toJSON } = renderWithProvider(
            <HomeScreenTemplate {...defaultProps} dimens={mobileDimens} locale="ja-JP" />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('calls goToSleepButton.onPress when go to sleep pressed', () => {
        const onPress = jest.fn();
        const { getByText } = renderWithProvider(
            <HomeScreenTemplate
                {...defaultProps}
                goToSleepButton={{ onPress }}
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        fireEvent.press(getByText(/go to sleep/i));
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});
