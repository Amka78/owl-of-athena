//#region Import Modules
import React from 'react';
import { render } from '@testing-library/react-native';
import { BluetoothIcon } from '../BluetoothIcon';
import { ConnectionStates } from '../../../sdk/AuroraConstants';
//#endregion

//#region Tests
describe('BluetoothIcon UnitTest', () => {
    it('renders correctly with CONNECTED state', () => {
        const { toJSON } = render(
            <BluetoothIcon connectionStates={ConnectionStates.CONNECTED} />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly with DISCONNECTED state', () => {
        const { toJSON } = render(
            <BluetoothIcon connectionStates={ConnectionStates.DISCONNECTED} />
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
