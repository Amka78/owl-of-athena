import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme, MessageKeys } from '../../../../constants';
import { ProfileOption } from '../ProfileOption';

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const toggleOption = {
    name: 'stim-enabled' as const,
    title: 'REM Stimulation',
    description: 'Enables REM stimulation when detected.',
    group: 'REM Stim Options' as const,
    groupName: MessageKeys.profile_rem_stim_options,
    value: false,
    field: { type: 'toggle' as const },
};

describe('ProfileOption', () => {
    it('renders a toggle option correctly', () => {
        const { toJSON } = renderWithProvider(
            <ProfileOption
                profileOption={toggleOption}
                failed={false}
                onHelpIconPress={jest.fn()}
                onValueChange={jest.fn()}
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders in failed state with failedConditionMessage', () => {
        const { toJSON } = renderWithProvider(
            <ProfileOption
                profileOption={{ ...toggleOption, failedConditionMessage: 'Requires firmware >= 2.0' }}
                failed={true}
                onHelpIconPress={jest.fn()}
                onValueChange={jest.fn()}
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
