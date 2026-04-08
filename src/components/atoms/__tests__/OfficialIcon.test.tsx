//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { OfficialIcon } from '../OfficialIcon';
//#endregion

//#region Tests
describe('OfficialIcon UnitTest', () => {
    it('renders correctly', () => {
        const { toJSON } = render(<OfficialIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
