//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { LeftSideButton } from '../LeftSideButton';
//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe('LeftSideButton UnitTest', () => {
    it('renders correctly', () => {
        const { toJSON } = renderWithProvider(
            <LeftSideButton screenWidth={375} needMargin={true}>Left</LeftSideButton>
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
