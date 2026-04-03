import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { ConvertibleContentTitle } from '../ConvertibleContentTitle';

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe('ConvertibleContentTitle', () => {
    it('renders title text when isDesktop is true', () => {
        const { getByText } = renderWithProvider(
            <ConvertibleContentTitle isDesktop={true}>
                Settings
            </ConvertibleContentTitle>
        );
        expect(getByText('Settings')).toBeTruthy();
    });

    it('renders nothing when isDesktop is false', () => {
        const { queryByText } = renderWithProvider(
            <ConvertibleContentTitle isDesktop={false}>
                Settings
            </ConvertibleContentTitle>
        );
        expect(queryByText('Settings')).toBeNull();
    });

    it('matches snapshot when desktop', () => {
        const { toJSON } = renderWithProvider(
            <ConvertibleContentTitle isDesktop={true}>
                Profile
            </ConvertibleContentTitle>
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
