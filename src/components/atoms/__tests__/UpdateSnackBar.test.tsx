//#region Import Modules

import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { UpdateSnackBarCore } from "../UpdateSnackBar";

//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe("UpdateSnackBar UnitTest", () => {
    it("renders correctly with showReload=true", () => {
        const { toJSON } = renderWithProvider(<UpdateSnackBarCore showReload={true} />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders correctly with showReload=false", () => {
        const { toJSON } = renderWithProvider(<UpdateSnackBarCore showReload={false} />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("reloads when the update action is pressed", () => {
        const reloadPageCallback = jest.fn();
        const { getByText } = renderWithProvider(
            <UpdateSnackBarCore showReload={true} reloadPageCallback={reloadPageCallback} />,
        );

        fireEvent.press(getByText("Update"));

        expect(reloadPageCallback).toHaveBeenCalledTimes(1);
    });
});
//#endregion
