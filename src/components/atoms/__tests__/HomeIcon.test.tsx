//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { HomeIcon } from '../HomeIcon';
//#endregion

//#region Tests
describe('HomeIcon UnitTest', () => {
    it('renders correctly', () => {
        const { toJSON } = render(<HomeIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
