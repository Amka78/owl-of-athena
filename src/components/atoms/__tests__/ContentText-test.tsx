//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { ContentText } from '../ContentText';
//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe('ContentText UnitTest', () => {
    it('renders correctly with children text', () => {
        const { toJSON } = renderWithProvider(
            <ContentText>Hello World</ContentText>
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
