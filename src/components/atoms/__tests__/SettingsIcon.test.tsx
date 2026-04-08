//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { SettingsIcon } from '../SettingsIcon';
//#endregion

//#region Tests
describe('SettingsIcon UnitTest', () => {
    it('renders correctly', () => {
        const { toJSON } = render(<SettingsIcon />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
