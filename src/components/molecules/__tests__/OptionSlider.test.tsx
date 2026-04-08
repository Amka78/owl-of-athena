import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { OptionSlider } from '../OptionSlider';

const leftIcon = (props: any) => (
    <View style={props.style}>
        <MaterialCommunityIcons name="clock" size={24} color={props.color} />
    </View>
);

const defaultProps = {
    title: 'Delay (minutes)',
    description: 'Set stimulation delay',
    left: leftIcon,
    disabled: false,
    value: 30,
    field: { type: 'slider' as const, format: 'minutes' as const, min: 0, max: 120, step: 5 },
    onValueChange: jest.fn(),
};

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe('OptionSlider', () => {
    it('renders correctly', () => {
        const { toJSON } = renderWithProvider(<OptionSlider {...defaultProps} />);
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders title', () => {
        const { getByText } = renderWithProvider(<OptionSlider {...defaultProps} />);
        expect(getByText('Delay (minutes)')).toBeTruthy();
    });
});
