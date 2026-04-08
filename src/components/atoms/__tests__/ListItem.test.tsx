//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { ListItem } from '../ListItem';
//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe('ListItem UnitTest', () => {
    it('renders correctly with title and description', () => {
        const { toJSON } = renderWithProvider(
            <ListItem title="Test Item" description="Description" />
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
