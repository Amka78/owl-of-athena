import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { SleepingScreenTemplate } from '../SleepingScreenTemplate';

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

describe('SleepingScreenTemplate', () => {
    it('renders correctly with en-US locale', () => {
        const { toJSON } = renderWithProvider(
            <SleepingScreenTemplate
                timeView={{ hours: 23, minutes: 0 }}
                onRelockPress={jest.fn()}
                onWakeupPress={jest.fn()}
                wakeLockMessage="Screen is locked"
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly with ja-JP locale', () => {
        const { toJSON } = renderWithProvider(
            <SleepingScreenTemplate
                timeView={{ hours: 23, minutes: 0 }}
                onRelockPress={jest.fn()}
                onWakeupPress={jest.fn()}
                wakeLockMessage="画面はロックされています"
                dimens={mobileDimens}
                locale="ja-JP"
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders in desktop mode', () => {
        const { toJSON } = renderWithProvider(
            <SleepingScreenTemplate
                timeView={{ hours: 23, minutes: 0 }}
                onRelockPress={jest.fn()}
                onWakeupPress={jest.fn()}
                wakeLockMessage="Screen is locked"
                dimens={desktopDimens}
                locale="en-US"
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('calls onWakeupPress when wakeup button pressed', () => {
        const onWakeupPress = jest.fn();
        const { getByText } = renderWithProvider(
            <SleepingScreenTemplate
                timeView={{ hours: 23, minutes: 0 }}
                onRelockPress={jest.fn()}
                onWakeupPress={onWakeupPress}
                wakeLockMessage="Screen is locked"
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        fireEvent.press(getByText(/wake up/i));
        expect(onWakeupPress).toHaveBeenCalledTimes(1);
    });

    it('displays wakeLockMessage', () => {
        const { getByText } = renderWithProvider(
            <SleepingScreenTemplate
                timeView={{ hours: 23, minutes: 0 }}
                onRelockPress={jest.fn()}
                onWakeupPress={jest.fn()}
                wakeLockMessage="Tap to relock screen"
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        expect(getByText('Tap to relock screen')).toBeTruthy();
    });
});
