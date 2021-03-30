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
    WakingScreenTemplate,
    WakingScreenTemplateProps,
} from "../WakingScreenTemplate";

let component: ShallowWrapper<WakingScreenTemplateProps, unknown, unknown>;

describe("WakingScreenTemplate UnitTest", () => {
    it.each(["us", "ja"])("renders correctly", (locale: string) => {
        const testEvent: () => void = () => {
            return;
        };
        Message.setLocale(locale);
        component = createMock(
            <WakingScreenTemplate
                timeView={{ hours: 0, minutes: 0 }}
                onWakeupPress={testEvent}
                dimens={DesktopDimension}
            ></WakingScreenTemplate>
        );

        expect(toJson(component)).toMatchSnapshot();
    });
});
