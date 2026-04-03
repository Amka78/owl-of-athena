//#region Import Modules
import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { StandardView } from '../StandardView';
//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe('StandardView UnitTest', () => {
    it('renders correctly with children', () => {
        const { toJSON } = renderWithProvider(
            <StandardView>
                <Text>Content</Text>
            </StandardView>
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
