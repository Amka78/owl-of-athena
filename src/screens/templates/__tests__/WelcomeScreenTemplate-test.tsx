import "jest-enzyme";
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";
import { WelcomeScreenTemplate } from "../WelcomeScreenTemplate";
import { TestHelper } from "../../../utils/TestHelper";

let component: ShallowWrapper<unknown, unknown, unknown>;

describe("WelcomeScreenTemplate UnitTest", () => {
    it("renders correctly", () => {
        const testKey = "test";
        const testEvent: () => void = () => {
            return;
        };
        component = TestHelper.createMock(
            <WelcomeScreenTemplate
                contentTitle={{ children: testKey }}
                contentText={{ children: testKey }}
                standaloneButton={{ children: testKey, onPress: testEvent }}
                loginButton={{ children: testKey, onPress: testEvent }}
                signupButton={{ children: testKey, onPress: testEvent }}
            ></WelcomeScreenTemplate>
        );

        expect(TestHelper.toJson(component)).toMatchSnapshot();
    });
});
