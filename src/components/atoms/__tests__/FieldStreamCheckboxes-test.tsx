//#region Import Modules
jest.mock('expo-av');
import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { FieldStreamCheckBoxes } from '../FieldStreamCheckboxes';
//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe('FieldStreamCheckBoxes UnitTest', () => {
    it('renders correctly', () => {
        const { toJSON } = renderWithProvider(
            <FieldStreamCheckBoxes
                field={{ type: 'checkboxes', choices: 'option1,option2', labelNone: 'None' }}
                value={0}
                disabled={false}
                onValueChange={jest.fn()}
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
