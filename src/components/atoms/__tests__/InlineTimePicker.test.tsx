//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { InlineTimePicker } from '../InlineTimePicker';
//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe('InlineTimePicker UnitTest', () => {
    it('renders without crashing', () => {
        const { toJSON } = renderWithProvider(<InlineTimePicker />);
        expect(toJSON()).toBeTruthy();
    });
});
//#endregion
