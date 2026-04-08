import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider, RadioButton } from 'react-native-paper';
import { Theme } from '../../../constants';
import { LabeledRadioButton } from '../LabeledRadioButton';

const renderWithProvider = (ui: React.ReactElement) =>
    render(
        <Provider theme={Theme}>
            <RadioButton.Group value="opt1" onValueChange={() => {}}>
                {ui}
            </RadioButton.Group>
        </Provider>
    );

describe('LabeledRadioButton', () => {
    it('renders correctly', () => {
        const { toJSON } = renderWithProvider(
            <LabeledRadioButton value="opt1" label="Option 1" />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders label text', () => {
        const { getByText } = renderWithProvider(
            <LabeledRadioButton value="opt1" label="Option 1" />
        );
        expect(getByText('Option 1')).toBeTruthy();
    });

    it('calls onLabelPress when label is pressed', () => {
        const onLabelPress = jest.fn();
        const { getByText } = renderWithProvider(
            <LabeledRadioButton value="opt1" label="Click me" onLabelPress={onLabelPress} />
        );
        fireEvent.press(getByText('Click me'));
        expect(onLabelPress).toHaveBeenCalledTimes(1);
    });
});
