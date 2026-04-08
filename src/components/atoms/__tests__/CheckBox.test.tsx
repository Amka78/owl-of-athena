//#region Import Modules
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { CheckBox } from '../CheckBox';
//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe('CheckBox UnitTest', () => {
    it('renders checked state', () => {
        const { toJSON } = renderWithProvider(<CheckBox status="checked" />);
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders unchecked state', () => {
        const { toJSON } = renderWithProvider(<CheckBox status="unchecked" />);
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders indeterminate state', () => {
        const { toJSON } = renderWithProvider(<CheckBox status="indeterminate" />);
        expect(toJSON()).toMatchSnapshot();
    });

    it('calls onPress when pressed', () => {
        const onPress = jest.fn();
        const { getByRole } = renderWithProvider(
            <CheckBox status="unchecked" onPress={onPress} />
        );
        fireEvent.press(getByRole('checkbox'));
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});
//#endregion
