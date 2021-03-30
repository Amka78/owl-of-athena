import "jest-enzyme";
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";
import { WelcomeScreenTemplate } from "../WelcomeScreenTemplate";
import {
    createMock,
    DesktopDimension,
    toJson,
} from "../../../utils/TestHelper";
import { Message } from "../../../constants";

let component: ShallowWrapper<unknown, unknown, unknown>;

describe("WelcomeScreenTemplate UnitTest", () => {
    it.each(["us", "ja"])("renders correctly", (locale: string) => {
        const testEvent: () => void = () => {
            return;
        };
        Message.setLocale(locale);
        component = createMock(
            <WelcomeScreenTemplate
                onLoginPress={testEvent}
                onSignupPress={testEvent}
                onStandalonePress={testEvent}
                dimens={DesktopDimension}
            ></WelcomeScreenTemplate>
        );

        expect(toJson(component)).toMatchSnapshot();
    });
});
