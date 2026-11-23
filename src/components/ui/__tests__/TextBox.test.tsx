//#region Import Modules

import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { TextBox } from "../TextBox";

//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe("TextBox UnitTest", () => {
    it("renders correctly with label", () => {
        const { toJSON } = renderWithProvider(<TextBox label="Username" />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
