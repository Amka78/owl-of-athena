//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { ProfilesIcon } from '../ProfilesIcon';
//#endregion

//#region Tests
describe('ProfilesIcon UnitTest', () => {
    it('renders correctly', () => {
        const { toJSON } = render(<ProfilesIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
