//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { RefreshIcon } from '../RefreshIcon';
//#endregion

//#region Tests
describe('RefreshIcon UnitTest', () => {
    it('renders correctly', () => {
        const { toJSON } = render(<RefreshIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
