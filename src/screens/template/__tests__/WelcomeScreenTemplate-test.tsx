import "jest-enzyme";
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";
import { WelcomeScreenTemplate } from "../WelcomeScreenTemplate";
import { TestHelper } from "../../../utils/TestHelper";

let component: ShallowWrapper<unknown, unknown, unknown>;

describe("WelcomeScreenTemplate UnitTest", () => {
    it("renders correctly", () => {
        const testKey = { key: "test" };
        const testEvent: () => void = () => {
            return;
        };
        component = TestHelper.createMock(
            <WelcomeScreenTemplate
                contentTitleText={testKey}
                contentText={testKey}
                standaloneButtonText={testKey}
                standaloneButtonPress={testEvent}
                loginButtonText={testKey}
                loginButtonPress={testEvent}
                signupButtonText={testKey}
                signupButtonPress={testEvent}
            ></WelcomeScreenTemplate>
        );

        expect(TestHelper.toJson(component)).toMatchSnapshot();
    });
});
