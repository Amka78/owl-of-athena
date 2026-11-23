//#region Import Modules

import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { ContentTitle } from "../ContentTitle";

//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe("ContentTitle UnitTest", () => {
    it("renders correctly with children text", () => {
        const { toJSON } = renderWithProvider(<ContentTitle>Title Text</ContentTitle>);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
