import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { OptionToggle } from '../OptionToggle';

const leftIcon = (props: any) => (
    <View style={props.style}>
        <MaterialCommunityIcons name="bell" size={24} color={props.color} />
    </View>
);

const defaultProps = {
    title: 'Enable Notifications',
    description: 'Receive alerts',
    left: leftIcon,
    disabled: false,
    value: 'enabled',
    field: { type: 'toggle' as const, valueEnabled: 'enabled', valueDisabled: 'disabled' },
    onValueChange: jest.fn(),
};

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe('OptionToggle', () => {
    it('renders correctly', () => {
        const { toJSON } = renderWithProvider(<OptionToggle {...defaultProps} />);
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders title', () => {
        const { getByText } = renderWithProvider(<OptionToggle {...defaultProps} />);
        expect(getByText('Enable Notifications')).toBeTruthy();
    });

    it('renders description', () => {
        const { getByText } = renderWithProvider(<OptionToggle {...defaultProps} />);
        expect(getByText('Receive alerts')).toBeTruthy();
    });
});
