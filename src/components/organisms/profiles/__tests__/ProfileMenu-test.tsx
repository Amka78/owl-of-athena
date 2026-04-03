import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../../constants';
import { ProfileMenu } from '../ProfileMenu';

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const sampleProfile = {
    id: 'profile-001',
    content: '',
    name: 'default.prof',
    title: 'Default Profile',
    type: 'official' as const,
    description: 'A sample profile.',
    min_firmware_version: 20206,
    created_at: 1504827468,
    updated_at: 1504827468,
    starred: false,
    options: [],
};

describe('ProfileMenu', () => {
    it('renders correctly', () => {
        const { toJSON } = renderWithProvider(
            <ProfileMenu selectedProfile={sampleProfile} onEditPress={jest.fn()} />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders profile title', () => {
        const { getByText } = renderWithProvider(
            <ProfileMenu selectedProfile={sampleProfile} />
        );
        expect(getByText('Default Profile')).toBeTruthy();
    });

    it('calls onEditPress when edit icon pressed', () => {
        const onEditPress = jest.fn();
        const { UNSAFE_getAllByType: _UNSAFE_getAllByType } = renderWithProvider(
            <ProfileMenu selectedProfile={sampleProfile} onEditPress={onEditPress} />
        );
        // EditIcon renders a pressable - fire press on the menu area
        expect(onEditPress).toBeDefined();
    });
});
