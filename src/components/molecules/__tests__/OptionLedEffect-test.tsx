import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { OptionLedEffect } from '../OptionLedEffect';

const leftIcon = (props: any) => (
    <View style={props.style}>
        <MaterialCommunityIcons name="led-on" size={24} color={props.color} />
    </View>
);

const defaultProps = {
    title: 'LED Effect',
    description: 'Choose LED effect',
    left: leftIcon,
    disabled: false,
    value: 'blink',
    field: { type: 'toggle' as const, valueEnabled: 'blink', valueDisabled: '' },
    onValueChange: jest.fn(),
};

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe('OptionLedEffect', () => {
    it('renders correctly', () => {
        const { toJSON } = renderWithProvider(<OptionLedEffect {...defaultProps} />);
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders title', () => {
        const { getByText } = renderWithProvider(<OptionLedEffect {...defaultProps} />);
        expect(getByText('LED Effect')).toBeTruthy();
    });
});
