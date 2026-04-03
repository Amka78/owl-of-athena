//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { FieldSlider } from '../FieldSlider';
//#endregion

//#region Tests
describe('FieldSlider UnitTest', () => {
    it('renders correctly', () => {
        const { toJSON } = render(
            <FieldSlider
                field={{ type: 'slider', format: 'minutes', min: 0, max: 60, step: 5 }}
                value={30}
                disabled={false}
                onValueChange={jest.fn()}
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
