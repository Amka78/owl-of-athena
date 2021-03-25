//#region Import Modules
import "jest-enzyme";
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { Button, ButtonProps } from "../Button";
import { Dimens } from "../../../constants";
//#endregion

//#region Tests
let component: ShallowWrapper<ButtonProps, unknown, unknown>;

describe("Button UnitTest", () => {
    it("renders correctly", () => {
        component = createMock(<Button screenWidth={200}>{"test"}</Button>);

        expect(toJson(component)).toMatchSnapshot();
    });

    it("If the button size exceeds the maximum value, it is set to the maximum value.", () => {
        component = createMock(<Button screenWidth={367}>{"test"}</Button>);

        const style = component.props().style as any;

        expect(style[1].width).toBe(Dimens.button_max_width);
    });
    it.each([true, false])(
        "If disabled is set, it will reflect that value.",
        (disabled: boolean) => {
            component = createMock(
                <Button screenWidth={200} disabled={disabled}>
                    {"test"}
                </Button>
            );
            expect(component.props().disabled).toBe(disabled);
        }
    );
});
//#endregion
