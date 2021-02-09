//#region Import Modules
import "jest-enzyme";
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { TestHelper } from "../../utils/TestHelper";
import { Button, ButtonProps } from "../atoms/Button";
//#endregion

//#region Tests
let component: ShallowWrapper<ButtonProps, unknown, unknown>;

describe("Button UnitTest", () => {
    it("renders correctly", () => {
        component = TestHelper.createMock(<Button>{"test"}</Button>);

        expect(TestHelper.toJson(component)).toMatchSnapshot();
    });

    /*
    it("can overide supportMultiligualState to false.", async () => {
        Message.setLocale("ja-JP");

        const props: IButtonProps = {
            title: "保存"
        };

        component = TestHelper.createMock(<Button {...props} />);
        expect(component.props().title).toBe("保存");
    });

    it("can overide supportMultiligualState to true.", async () => {
        Message.setLocale("ja-JP");

        const props: IButtonProps = {
            localizedTitle: "save"
        };

        component = TestHelper.createMock(<Button {...props} />);
        expect(component.props().title).toBe("保存する。");
    });

    it("can override props", () => {
        Message.setLocale("ja-JP");
        const props: IButtonProps = {
            buttonStyle: {
                backgroundColor: "red",
                borderColor: "white",
                borderRadius: 6,
                borderWidth: 0
            },
            containerStyle: { marginTop: 30, width: "100%" },
            title: "save",
            titleStyle: { fontWeight: "800", backgroundColor: "red" }
        };

        component = TestHelper.createMock(<Button {...props} />);

        // @ts-ignore
        expect(component.props().titleStyle!.fontWeight).toBe("800");
        // @ts-ignore
        expect(component.props().titleStyle!.backgroundColor).toBe("red");
        // @ts-ignore
        expect(component.props().containerStyle!.marginTop).toBe(30);
        // @ts-ignore
        expect(component.props().containerStyle!.width).toBe("100%");
        // @ts-ignore
        expect(component.props().buttonStyle!.backgroundColor).toBe("red");
        // @ts-ignore
        expect(component.props().buttonStyle!.borderColor).toBe("white");
        // @ts-ignore
        expect(component.props().buttonStyle!.borderRadius).toBe(6);
        // @ts-ignore
        expect(component.props().buttonStyle!.borderWidth).toBe(0);
    });
    */
});
//#endregion
