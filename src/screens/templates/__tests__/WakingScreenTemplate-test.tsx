import "jest-enzyme";
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";
import {
    WakingScreenTemplate,
    WakingScreenTemplateProps,
} from "../WakingScreenTemplate";
import { TestHelper } from "../../../utils/TestHelper";

let component: ShallowWrapper<WakingScreenTemplateProps, unknown, unknown>;

describe("WakingScreenTemplate UnitTest", () => {
    it("renders correctly", () => {
        const testKey = "test";
        const testEvent: () => void = () => {
            return;
        };
        component = TestHelper.createMock(
            <WakingScreenTemplate
                contentTitle={{ children: testKey }}
                contentText={{ children: testKey }}
                timeView={{ hours: 0, minutes: 0 }}
                wakeupButton={{ children: testKey, onPress: testEvent }}
            ></WakingScreenTemplate>
        );

        expect(TestHelper.toJson(component)).toMatchSnapshot();
    });
});
