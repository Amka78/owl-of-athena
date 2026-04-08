//#region Import Modules

import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { ContentText } from "../ContentText";

//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe("ContentText UnitTest", () => {
    it("renders correctly with children text", () => {
        const { toJSON } = renderWithProvider(<ContentText>Hello World</ContentText>);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
