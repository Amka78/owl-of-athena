//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { SessionsIcon } from '../SessionsIcon';
//#endregion

//#region Tests
describe('SessionsIcon UnitTest', () => {
    it('renders correctly', () => {
        const { toJSON } = render(<SessionsIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
