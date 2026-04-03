import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { ConfirmDialog } from '../ConfirmDialog';

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe('ConfirmDialog', () => {
    it('does not show dialog content initially', () => {
        const { queryByText } = renderWithProvider(<ConfirmDialog />);
        expect(queryByText('Confirm Action')).toBeNull();
    });

    it('shows dialog after ConfirmDialog.show() is called', async () => {
        const onConfirm = jest.fn();
        const onDissmiss = jest.fn();
        const { getByText } = renderWithProvider(<ConfirmDialog />);

        await act(async () => {
            ConfirmDialog.show({
                title: 'Confirm Action',
                message: 'Are you sure?',
                onConfirm,
                onDissmiss,
            });
        });

        expect(getByText('Confirm Action')).toBeTruthy();
        expect(getByText('Are you sure?')).toBeTruthy();
    });

    it('calls onConfirm when OK is pressed', async () => {
        const onConfirm = jest.fn();
        const { getByText } = renderWithProvider(<ConfirmDialog />);

        await act(async () => {
            ConfirmDialog.show({
                title: 'Delete',
                message: 'Delete this item?',
                onConfirm,
            });
        });

        fireEvent.press(getByText('OK'));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('shows cancel button when isCancelable is true', async () => {
        const { getByText } = renderWithProvider(<ConfirmDialog />);

        await act(async () => {
            ConfirmDialog.show({
                title: 'Delete',
                message: 'Delete this item?',
                isCancelable: true,
                onConfirm: jest.fn(),
            });
        });

        expect(getByText('CANCEL')).toBeTruthy();
    });
});
