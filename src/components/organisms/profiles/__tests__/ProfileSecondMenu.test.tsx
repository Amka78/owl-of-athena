import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../../constants';
import { ProfileSecondMenu } from '../ProfileSecondMenu';

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const mobileDimens = {
    fontScale: 1,
    scale: 1,
    height: 800,
    width: 400,
    isDesktop: false,
    isLargeWidth: false,
    isSmallHeight: false,
    isVertical: true,
    isHorizontal: false,
};

describe('ProfileSecondMenu', () => {
    it('renders correctly when connected', () => {
        const { toJSON } = renderWithProvider(
            <ProfileSecondMenu
                auroraConnected={true}
                selectedProfileHasUnsavedChanges={false}
                dimens={mobileDimens}
                onSaveToAuroraPress={jest.fn()}
                onShowAdvancedOptionsPress={jest.fn()}
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly when disconnected', () => {
        const { toJSON } = renderWithProvider(
            <ProfileSecondMenu
                auroraConnected={false}
                selectedProfileHasUnsavedChanges={true}
                dimens={mobileDimens}
                onSaveToAuroraPress={jest.fn()}
                onShowAdvancedOptionsPress={jest.fn()}
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('calls onShowAdvancedOptionsPress when advanced options pressed', () => {
        const onPress = jest.fn();
        const { getByText } = renderWithProvider(
            <ProfileSecondMenu
                auroraConnected={true}
                selectedProfileHasUnsavedChanges={false}
                dimens={mobileDimens}
                onSaveToAuroraPress={jest.fn()}
                onShowAdvancedOptionsPress={onPress}
            />
        );
        // Find the advanced options flat button and press it
        const btn = getByText(/advanced/i);
        fireEvent.press(btn);
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});
