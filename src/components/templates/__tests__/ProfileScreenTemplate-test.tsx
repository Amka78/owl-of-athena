import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { ProfileScreenTemplate } from '../ProfileScreenTemplate';
import { defaultOptions, groupingProfileOptionList } from '../../../services/ProfileService';

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const groupedOptionList = groupingProfileOptionList(defaultOptions);

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

const mobileDimens = {
    fontScale: 1, scale: 1, height: 800, width: 400,
    isDesktop: false, isLargeWidth: false, isSmallHeight: false,
    isVertical: true, isHorizontal: false,
};

const defaultProps = {
    auroraConnected: true,
    selectedProfileHasUnSavedChanges: false,
    selectedProfile: sampleProfile,
    isUserProfile: true,
    unsavePrfileMenu: {
        onSaveAsNewPress: jest.fn(),
        onOverwriteSavePress: jest.fn(),
        onCancelPress: jest.fn(),
    },
    profileMenu: { onInfoPress: jest.fn() },
    profileSecondMenu: {
        onSaveToAuroraPress: jest.fn(),
        onShowAdvancedOptionsPress: jest.fn(),
    },
    grouedOptionList: groupedOptionList,
    dimens: mobileDimens,
};

describe('ProfileScreenTemplate', () => {
    it('renders correctly with saved profile', () => {
        const { toJSON } = renderWithProvider(
            <ProfileScreenTemplate {...defaultProps} locale="en-US" />
        );
        expect(toJSON()).toBeTruthy();
    });

    it('renders correctly with unsaved changes', () => {
        const { toJSON } = renderWithProvider(
            <ProfileScreenTemplate
                {...defaultProps}
                selectedProfileHasUnSavedChanges={true}
                locale="en-US"
            />
        );
        expect(toJSON()).toBeTruthy();
    });

    it('shows profile title when no unsaved changes', () => {
        const { getByText } = renderWithProvider(
            <ProfileScreenTemplate {...defaultProps} locale="en-US" />
        );
        expect(getByText('Default Profile')).toBeTruthy();
    });
});
