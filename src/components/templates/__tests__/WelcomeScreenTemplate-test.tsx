import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { WelcomeScreenTemplate } from '../WelcomeScreenTemplate';

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
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

describe('WelcomeScreenTemplate', () => {
    it('renders correctly with en-US locale', () => {
        const { toJSON } = renderWithProvider(
            <WelcomeScreenTemplate
                onLoginPress={jest.fn()}
                onSignupPress={jest.fn()}
                onStandalonePress={jest.fn()}
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly with ja-JP locale', () => {
        const { toJSON } = renderWithProvider(
            <WelcomeScreenTemplate
                onLoginPress={jest.fn()}
                onSignupPress={jest.fn()}
                onStandalonePress={jest.fn()}
                dimens={mobileDimens}
                locale="ja-JP"
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly in desktop mode', () => {
        const { toJSON } = renderWithProvider(
            <WelcomeScreenTemplate
                onLoginPress={jest.fn()}
                onSignupPress={jest.fn()}
                onStandalonePress={jest.fn()}
                dimens={desktopDimens}
                locale="en-US"
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('calls onLoginPress when login button pressed', () => {
        const onLoginPress = jest.fn();
        const { getByText } = renderWithProvider(
            <WelcomeScreenTemplate
                onLoginPress={onLoginPress}
                onSignupPress={jest.fn()}
                onStandalonePress={jest.fn()}
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        fireEvent.press(getByText(/log in/i));
        expect(onLoginPress).toHaveBeenCalledTimes(1);
    });
});
