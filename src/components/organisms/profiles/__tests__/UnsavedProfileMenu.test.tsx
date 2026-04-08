import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../../constants';
import { UnsavedProfileMenu } from '../UnsavedProfileMenu';

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

describe('UnsavedProfileMenu', () => {
    it('renders correctly for user profile', () => {
        const { toJSON } = renderWithProvider(
            <UnsavedProfileMenu
                isUserProfile={true}
                dimens={mobileDimens}
                onSaveAsNewPress={jest.fn()}
                onOverwriteSavePress={jest.fn()}
                onCancelPress={jest.fn()}
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly for non-user profile (no overwrite button)', () => {
        const { toJSON } = renderWithProvider(
            <UnsavedProfileMenu
                isUserProfile={false}
                dimens={mobileDimens}
                onSaveAsNewPress={jest.fn()}
                onOverwriteSavePress={jest.fn()}
                onCancelPress={jest.fn()}
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('calls onCancelPress when cancel is pressed', () => {
        const onCancelPress = jest.fn();
        const { getByText } = renderWithProvider(
            <UnsavedProfileMenu
                isUserProfile={true}
                dimens={mobileDimens}
                onSaveAsNewPress={jest.fn()}
                onOverwriteSavePress={jest.fn()}
                onCancelPress={onCancelPress}
            />
        );
        const cancelBtn = getByText(/cancel/i);
        fireEvent.press(cancelBtn);
        expect(onCancelPress).toHaveBeenCalledTimes(1);
    });
});
