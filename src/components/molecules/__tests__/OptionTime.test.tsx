import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { OptionTime } from '../OptionTime';

const leftIcon = (props: any) => (
    <View style={props.style}>
        <MaterialCommunityIcons name="alarm" size={24} color={props.color} />
    </View>
);

const defaultProps = {
    title: 'Wake-up Time',
    description: 'Set wake time',
    left: leftIcon,
    disabled: false,
    value: '07:30',
    field: { type: 'time' as const, clearable: true, labelCleared: 'Not set', minutesStep: 5, defaultTime: 0 },
    onValueChange: jest.fn(),
};

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe('OptionTime', () => {
    it('renders without crashing', () => {
        const { toJSON } = renderWithProvider(<OptionTime {...defaultProps} />);
        expect(toJSON()).toBeTruthy();
    });

    it('renders title', () => {
        const { getByText } = renderWithProvider(<OptionTime {...defaultProps} />);
        expect(getByText('Wake-up Time')).toBeTruthy();
    });
});
