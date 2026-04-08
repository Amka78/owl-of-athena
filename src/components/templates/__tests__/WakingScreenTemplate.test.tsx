import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { WakingScreenTemplate } from '../WakingScreenTemplate';

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

describe('WakingScreenTemplate', () => {
    it('renders correctly with en-US locale', () => {
        const { toJSON } = renderWithProvider(
            <WakingScreenTemplate
                timeView={{ hours: 6, minutes: 30 }}
                onWakeupPress={jest.fn()}
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly with ja-JP locale', () => {
        const { toJSON } = renderWithProvider(
            <WakingScreenTemplate
                timeView={{ hours: 6, minutes: 30 }}
                onWakeupPress={jest.fn()}
                dimens={mobileDimens}
                locale="ja-JP"
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders in desktop mode', () => {
        const { toJSON } = renderWithProvider(
            <WakingScreenTemplate
                timeView={{ hours: 6, minutes: 30 }}
                onWakeupPress={jest.fn()}
                dimens={desktopDimens}
                locale="en-US"
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('calls onWakeupPress when wakeup button pressed', () => {
        const onWakeupPress = jest.fn();
        const { getByText } = renderWithProvider(
            <WakingScreenTemplate
                timeView={{ hours: 6, minutes: 30 }}
                onWakeupPress={onWakeupPress}
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        fireEvent.press(getByText(/wake up/i));
        expect(onWakeupPress).toHaveBeenCalledTimes(1);
    });
});
