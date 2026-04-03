//#region Import Modules
import React from "react";
import { render } from "@testing-library/react-native";

import { FlexSpacer } from "../FlexSpacer";
//#endregion

//#region Test
describe("FlexSpacer UnitTest", () => {
    it("Renders correctly", () => {
        const { toJSON } = render(<FlexSpacer />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("Renders a View with flex:1 style", () => {
        const { getByTestId, toJSON } = render(
            <FlexSpacer testID="spacer" />
        );
        const json = toJSON() as any;
        expect(json.props.style).toMatchObject({ flex: 1 });
    });
});
//#endregion
