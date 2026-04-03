import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../../constants';
import { ProfileListMenu } from '../ProfileListMenu';

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const defaultProps = {
    showOfficialCheckBoxStatus: 'checked' as const,
    onShowOfficialCheckBoxPress: jest.fn(),
    showCommunityCheckBoxStatus: 'unchecked' as const,
    onShowCommunityCheckBoxPress: jest.fn(),
    showPrivateCheckBoxStatus: 'indeterminate' as const,
    onShowPrivateCheckBoxPress: jest.fn(),
};

describe('ProfileListMenu', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { toJSON } = renderWithProvider(<ProfileListMenu {...defaultProps} />);
        expect(toJSON()).toMatchSnapshot();
    });

    it('calls onShowOfficialCheckBoxPress when official checkbox pressed', () => {
        const onPress = jest.fn();
        const { getAllByRole } = renderWithProvider(
            <ProfileListMenu {...defaultProps} onShowOfficialCheckBoxPress={onPress} />
        );
        const checkboxes = getAllByRole('checkbox');
        fireEvent.press(checkboxes[0]);
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});
