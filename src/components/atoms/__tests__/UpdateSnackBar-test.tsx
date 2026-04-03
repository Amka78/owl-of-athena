//#region Import Modules
jest.mock('expo-av');
import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { UpdateSnackBarCore } from '../UpdateSnackBar';
//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe('UpdateSnackBar UnitTest', () => {
    it('renders correctly with showReload=true', () => {
        const { toJSON } = renderWithProvider(
            <UpdateSnackBarCore showReload={true} />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly with showReload=false', () => {
        const { toJSON } = renderWithProvider(
            <UpdateSnackBarCore showReload={false} />
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
