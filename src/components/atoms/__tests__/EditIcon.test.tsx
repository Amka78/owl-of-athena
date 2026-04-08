//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { EditIcon } from '../EditIcon';
//#endregion

//#region Tests
describe('EditIcon UnitTest', () => {
    it('renders correctly', () => {
        const { toJSON } = render(<EditIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
