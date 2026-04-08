//#region Import Modules
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { FlatButton } from '../FlatButton';
//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe('FlatButton UnitTest', () => {
    it('renders correctly with children', () => {
        const { toJSON } = renderWithProvider(
            <FlatButton>Test Button</FlatButton>
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('calls onPress when pressed', () => {
        const onPress = jest.fn();
        const { getByText } = renderWithProvider(
            <FlatButton onPress={onPress}>Test Button</FlatButton>
        );
        fireEvent.press(getByText('Test Button'));
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});
//#endregion
