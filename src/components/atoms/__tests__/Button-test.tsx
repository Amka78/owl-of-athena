//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { Button } from '../Button';
//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe('Button UnitTest', () => {
    it('renders correctly', () => {
        const { toJSON } = renderWithProvider(
            <Button screenWidth={375}>Test</Button>
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders in disabled state', () => {
        const { toJSON } = renderWithProvider(
            <Button screenWidth={375} disabled={true}>Test</Button>
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
