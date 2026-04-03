//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { BatteryIcon } from '../BatteryIcon';
//#endregion

//#region Tests
describe('BatteryIcon UnitTest', () => {
    it('renders correctly', () => {
        const { toJSON } = render(
            <BatteryIcon batteryLevel={100} isUSBConnected={true} />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders with USB connected', () => {
        const { toJSON } = render(
            <BatteryIcon batteryLevel={80} isUSBConnected={true} />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders without USB connected', () => {
        const { toJSON } = render(
            <BatteryIcon batteryLevel={80} isUSBConnected={false} />
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
