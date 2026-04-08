//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { FieldTime } from '../FieldTime';
//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe('FieldTime UnitTest', () => {
    it('renders correctly', () => {
        const { toJSON } = renderWithProvider(
            <FieldTime
                field={{ type: 'time', clearable: true, labelCleared: 'Cleared', minutesStep: 5, defaultTime: 480 }}
                value="08:00"
                disabled={false}
                onValueChange={jest.fn()}
            />
        );
        expect(toJSON()).toBeTruthy();
    });
});
//#endregion
