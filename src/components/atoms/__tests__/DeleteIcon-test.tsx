//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { DeleteIcon } from '../DeleteIcon';
//#endregion

//#region Tests
describe('DeleteIcon UnitTest', () => {
    it('renders correctly', () => {
        const { toJSON } = render(<DeleteIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
