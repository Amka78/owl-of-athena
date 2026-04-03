//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { StarIcon } from '../StarIcon';
//#endregion

//#region Tests
describe('StarIcon UnitTest', () => {
    it('renders correctly with starred=true', () => {
        const { toJSON } = render(<StarIcon starred={true} />);
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly with starred=false', () => {
        const { toJSON } = render(<StarIcon starred={false} />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
