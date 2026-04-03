//#region Import Modules
jest.mock('expo-av');
import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { FieldLedEffect } from '../FieldLedEffect';
//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe('FieldLedEffect UnitTest', () => {
    it('renders correctly', () => {
        const { toJSON } = renderWithProvider(
            <FieldLedEffect
                value="blink"
                disabled={false}
                onPreviewEffectPress={jest.fn()}
                onValueChange={jest.fn()}
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
