//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { InfoIcon } from '../Infocon';
//#endregion

//#region Tests
describe('InfoIcon UnitTest', () => {
    it('renders correctly', () => {
        const { toJSON } = render(<InfoIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
