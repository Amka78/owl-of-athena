import "jest-enzyme";
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { Message } from "../../../constants";
import {
    createMock,
    DesktopDimension,
    toJson,
} from "../../../utils/TestHelper";
import {
    SleepingScreenTemplate,
    SleepingScreenTemplateProps,
} from "../SleepingScreenTemplate";

let component: ShallowWrapper<SleepingScreenTemplateProps, unknown, unknown>;

describe("SleepingScreenTemplate UnitTest", () => {
    it.each(["us", "ja"])("renders correctly", (locale: string) => {
        const testEvent: () => void = () => {
            return;
        };
        Message.setLocale(locale);
        component = createMock(
            <SleepingScreenTemplate
                timeView={{ hours: 0, minutes: 0 }}
                onRelockPress={testEvent}
                onWakeupPress={testEvent}
                wakeLockMessage={"test"}
                dimens={DesktopDimension}
            ></SleepingScreenTemplate>
        );

        expect(toJson(component)).toMatchSnapshot();
    });
});
