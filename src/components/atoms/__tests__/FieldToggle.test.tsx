//#region Import Modules

import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { FieldToggle } from "../FieldToggle";

//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe("FieldToggle UnitTest", () => {
    it("renders correctly with value enabled", () => {
        const { toJSON } = renderWithProvider(
            <FieldToggle
                field={{ type: "toggle", valueEnabled: "enabled", valueDisabled: "disabled" }}
                value="enabled"
                disabled={false}
                onValueChange={jest.fn()}
            />,
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
