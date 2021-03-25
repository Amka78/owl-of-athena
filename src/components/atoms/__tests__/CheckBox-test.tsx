//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { CheckBox, CheckBoxProps } from "../CheckBox";
import { Colors } from "../../../constants";
//#endregion

//#region Test
let component: ShallowWrapper<CheckBoxProps, unknown, unknown>;
describe("CheckBoxEx UnitTest", () => {
    it("renders correctly", () => {
        component = createMock(<CheckBox status={"checked"}></CheckBox>);

        expect(toJson(component)).toMatchSnapshot();
    });

    it("If a colour has been set, this value should be reflected.", () => {
        component = createMock(
            <CheckBox
                status={"unchecked"}
                color={Colors.white}
                uncheckedColor={Colors.red}
            ></CheckBox>
        );

        const props = component.props();

        expect(props.color).toBe(Colors.white);
        expect(props.uncheckedColor).toBe(Colors.red);
    });
});
//#endregion
