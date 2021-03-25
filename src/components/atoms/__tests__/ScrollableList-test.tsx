//#region Import Modules
import { View } from "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { ScrollableList, ScrollableListProps } from "../ScrollableList";
//#endregion

//#region Test
let component: ShallowWrapper<ScrollableListProps, unknown, unknown>;
describe("ScrollableList UnitTest", () => {
    it("renders correctly", () => {
        component = createMock(
            <ScrollableList>
                [<View />,
                <View />]
            </ScrollableList>
        );

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
