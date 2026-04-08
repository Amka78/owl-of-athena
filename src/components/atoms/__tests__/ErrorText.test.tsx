//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { ErrorText } from '../ErrorText';
//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe('ErrorText UnitTest', () => {
    it('renders correctly with children text', () => {
        const { toJSON } = renderWithProvider(
            <ErrorText>Error message</ErrorText>
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders without children', () => {
        const { toJSON } = renderWithProvider(<ErrorText />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
