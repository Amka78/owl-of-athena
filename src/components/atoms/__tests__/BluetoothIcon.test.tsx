//#region Import Modules

import { render } from "@testing-library/react-native";
import React from "react";
import { ConnectionStates } from "../../../sdk/AuroraConstants";
import { BluetoothIcon } from "../BluetoothIcon";

//#endregion

//#region Tests
describe("BluetoothIcon UnitTest", () => {
    it("renders correctly with CONNECTED state", () => {
        const { toJSON } = render(<BluetoothIcon connectionStates={ConnectionStates.CONNECTED} />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders correctly with DISCONNECTED state", () => {
        const { toJSON } = render(
            <BluetoothIcon connectionStates={ConnectionStates.DISCONNECTED} />,
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
