//#region Import Modules
import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { ScrollableList } from '../ScrollableList';
//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe('ScrollableList UnitTest', () => {
    it('renders correctly with children', () => {
        const { toJSON } = renderWithProvider(
            <ScrollableList>
                <Text>Item 1</Text>
                <Text>Item 2</Text>
            </ScrollableList>
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
