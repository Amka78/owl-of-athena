//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { FilterIcon } from '../FilterIcon';
//#endregion

//#region Tests
describe('FilterIcon UnitTest', () => {
    it('renders correctly', () => {
        const { toJSON } = render(<FilterIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
