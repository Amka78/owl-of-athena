//#region Import Modules

import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { Button } from "../Button";

//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe("Button UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<Button screenWidth={375}>Test</Button>);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders in disabled state", () => {
        const { toJSON } = renderWithProvider(
            <Button screenWidth={375} disabled={true}>
                Test
            </Button>,
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
