//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { ListItem, ListItemProps } from "../ListItem";
//#endregion

//#region Test
let component: ShallowWrapper<ListItemProps, unknown, unknown>;
describe("ListItem UnitTest", () => {
    it("Renders correctly", () => {
        component = createMock(
            <ListItem title={"test"} description={"testDesc"}></ListItem>
        );

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
