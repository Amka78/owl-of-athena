import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { LabeledTimeView } from '../LabeledTimeView';

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe('LabeledTimeView', () => {
    it('renders correctly', () => {
        const { toJSON } = renderWithProvider(
            <LabeledTimeView label="Wake Up" hours={7} minutes={30} mode="meridian" />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders label', () => {
        const { getByText } = renderWithProvider(
            <LabeledTimeView label="Wake Up" hours={7} minutes={30} mode="meridian" />
        );
        expect(getByText('Wake Up')).toBeTruthy();
    });

    it('renders in time mode', () => {
        const { toJSON } = renderWithProvider(
            <LabeledTimeView label="Duration" hours={8} minutes={0} mode="time" />
        );
        expect(toJSON()).toBeTruthy();
    });
});
