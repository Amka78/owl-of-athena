//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { LogoutIcon } from '../LogoutIcon';
//#endregion

//#region Tests
describe('LogoutIcon UnitTest', () => {
    it('renders correctly', () => {
        const { toJSON } = render(<LogoutIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
