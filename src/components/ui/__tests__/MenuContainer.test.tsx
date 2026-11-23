//#region Import Modules

import { render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import { MenuContainer } from "../MenuContainer";

//#endregion

//#region Tests
describe("MenuContainer UnitTest", () => {
    it("renders correctly with children", () => {
        const { toJSON } = render(
            <MenuContainer>
                <Text>Menu Item</Text>
            </MenuContainer>,
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
