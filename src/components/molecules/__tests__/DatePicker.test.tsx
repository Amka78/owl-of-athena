import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { DatePicker } from '../DatePicker';

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe('DatePicker', () => {
    it('renders correctly', () => {
        const { toJSON } = renderWithProvider(
            <DatePicker label="Select Date" selected={new Date('2024-01-15')} format="YYYY/MM/DD" />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders label', () => {
        const { getAllByText } = renderWithProvider(
            <DatePicker label="Birth Date" selected={new Date('2024-06-01')} format="YYYY/MM/DD" />
        );
        expect(getAllByText('Birth Date').length).toBeGreaterThan(0);
    });

    it('renders with a format', () => {
        const { toJSON } = renderWithProvider(
            <DatePicker label="Date" selected={new Date('2024-01-15')} format="YYYY/MM/DD" />
        );
        expect(toJSON()).toBeTruthy();
    });
});
