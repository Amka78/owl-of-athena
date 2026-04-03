import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { ProfilesDialog } from '../ProfilesDialog';

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const mockProfiles = [
    { id: '1', title: 'Default Profile', name: 'default', content: '', type: 'official' as const, created_at: 0, updated_at: 0, min_firmware_version: 0, options: [] },
    { id: '2', title: 'Custom Profile', name: 'custom', content: '', type: 'private' as const, created_at: 0, updated_at: 0, min_firmware_version: 0, options: [] },
];

describe('ProfilesDialog', () => {
    it('renders nothing initially', () => {
        const { queryByText } = renderWithProvider(<ProfilesDialog />);
        expect(queryByText('Default Profile')).toBeNull();
    });

    it('shows dialog after ProfilesDialog.show() is called', async () => {
        const onConfirm = jest.fn();
        const { getByText } = renderWithProvider(<ProfilesDialog />);

        await act(async () => {
            ProfilesDialog.show({
                profileList: mockProfiles,
                selectedProfileId: '1',
                onConfirm,
            });
        });

        expect(getByText('Default Profile')).toBeTruthy();
        expect(getByText('Custom Profile')).toBeTruthy();
    });
});
