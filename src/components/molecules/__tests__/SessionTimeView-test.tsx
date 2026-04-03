import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { SessionTimeView } from '../SessionTimeView';

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe('SessionTimeView', () => {
    it('renders correctly in mobile mode', () => {
        const { toJSON } = renderWithProvider(
            <SessionTimeView label="Session" hours={7} minutes={30} mode="meridian" isDesktop={false} />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly in desktop mode', () => {
        const { toJSON } = renderWithProvider(
            <SessionTimeView label="Session" hours={8} minutes={0} mode="time" isDesktop={true} />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders label text', () => {
        const { getByText } = renderWithProvider(
            <SessionTimeView label="Wake Up" hours={7} minutes={30} mode="meridian" isDesktop={false} />
        );
        expect(getByText('Wake Up')).toBeTruthy();
    });
});
