import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { SessionScreenTemplate } from '../SessionScreenTemplate';
import { AuroraSession } from '../../../sdk/models';

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const mockSessionDetail = {
    sleepEvents: [],
    movementEvents: [],
};

const defaultProps = {
    asleepAtTimeLabel: { hours: 23, minutes: 0 },
    chartRadialProgress: { value: 75, valueLabel: '75' },
    awakeTimeLabel: { hours: 7, minutes: 30 },
    leftSelectButton: { onPress: jest.fn() },
    rightSelectButton: { onPress: jest.fn() },
    currentChart: 'SleepChart' as const,
    sessionSleepChart: {
        scaleXDomain: [],
        isFilterEnabled: false,
        sessionDetail: mockSessionDetail as any,
        totalSleepHour: 8,
    },
    sessionChartPie: {
        session: null as unknown as AuroraSession,
    },
    sleepDurationLabel: { hours: 8, minutes: 30 },
    remDurationLabel: { hours: 1, minutes: 45 },
    deepDurationLabel: { hours: 0, minutes: 45 },
};

describe('SessionScreenTemplate', () => {
    it('renders correctly with en-US locale', () => {
        const { toJSON } = renderWithProvider(
            <SessionScreenTemplate {...defaultProps} locale="en-US" />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly with ja-JP locale', () => {
        const { toJSON } = renderWithProvider(
            <SessionScreenTemplate {...defaultProps} locale="ja-JP" />
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
