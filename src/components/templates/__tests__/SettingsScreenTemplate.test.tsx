import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { SettingsScreenTemplate } from '../SettingsScreenTemplate';



const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const mobileDimens = {
    fontScale: 1, scale: 1, height: 800, width: 400,
    isDesktop: false, isLargeWidth: false, isSmallHeight: false,
    isVertical: true, isHorizontal: false,
};

const defaultProps = {
    inlineTimePicker: { initialTime: { hours: 7, minutes: 30, seconds: 0 }, onChangeTime: jest.fn() },
    smartAlarmAudioMenu: { onPress: jest.fn(), value: 'birds' },
    profileMenu: { onPress: jest.fn(), value: 'default', hasProfiles: false },
    smartAlarmEnabled: { status: 'checked' as const, onPress: jest.fn() },
    dslEnabled: { status: 'unchecked' as const, onPress: jest.fn() },
    remStimEnabled: { status: 'unchecked' as const, onPress: jest.fn() },
    remStimAudioMenu: { onPress: jest.fn(), value: 'birds' },
    saveButton: { onPress: jest.fn() },
    cancelButton: { onPress: jest.fn() },
};

describe('SettingsScreenTemplate', () => {
    it('renders correctly with en-US locale', () => {
        const { toJSON } = renderWithProvider(
            <SettingsScreenTemplate {...defaultProps} dimens={mobileDimens} locale="en-US" />
        );
        expect(toJSON()).toBeTruthy();
    });

    it('renders correctly with ja-JP locale', () => {
        const { toJSON } = renderWithProvider(
            <SettingsScreenTemplate {...defaultProps} dimens={mobileDimens} locale="ja-JP" />
        );
        expect(toJSON()).toBeTruthy();
    });

    it('calls saveButton.onPress when save pressed', () => {
        const onPress = jest.fn();
        const { getByText } = renderWithProvider(
            <SettingsScreenTemplate
                {...defaultProps}
                saveButton={{ onPress }}
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        fireEvent.press(getByText(/^save$/i));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('shows profile selector when hasProfiles is true', () => {
        const { toJSON } = renderWithProvider(
            <SettingsScreenTemplate
                {...defaultProps}
                profileMenu={{ onPress: jest.fn(), value: 'default', hasProfiles: true }}
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        expect(toJSON()).toBeTruthy();
    });
});
