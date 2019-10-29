import "react-native";

import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import React from "react";

import { MultiLingualTextBox } from "../MultiLingualTextBox";

describe("TextBoxEx UnitTest", () => {
    beforeAll(async () => {
        jest.mock("Animated", () => ({
            Value: jest.fn(() => ({
                interpolate: jest.fn(),
                setValue: jest.fn()
            })),
            timing: jest.fn(() => ({
                start: jest.fn()
            }))
        }));
    });

    it("renders correctly", () => {
        const tree = toJson(shallow(<MultiLingualTextBox />));

        expect(tree).toMatchSnapshot();
    });

    afterAll(async () => {
        jest.dontMock("Animated");
    });
});
