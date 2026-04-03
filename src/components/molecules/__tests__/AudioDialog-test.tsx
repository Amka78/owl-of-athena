import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { AudioDialog, AudioList } from '../AudioDialog';

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe('AudioDialog', () => {
    it('renders without showing dialog initially', () => {
        const { queryByText } = renderWithProvider(
            <AudioDialog auroraSoundList={[]} />
        );
        expect(queryByText('A New Day')).toBeNull();
    });

    it('shows dialog after AudioDialog.show() is called', async () => {
        const onConfirm = jest.fn();
        const { getByText } = renderWithProvider(
            <AudioDialog auroraSoundList={[]} />
        );

        await act(async () => {
            AudioDialog.show(
                { onConfirm },
                AudioList.A_NEY_DAY
            );
        });

        expect(getByText('A New Day')).toBeTruthy();
    });
});
