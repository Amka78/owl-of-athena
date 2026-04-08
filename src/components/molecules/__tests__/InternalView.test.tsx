import { render } from "@testing-library/react-native";
import type React from "react";
import { Text } from "react-native";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { InternalView } from "../InternalView";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("InternalView", () => {
    it("renders children correctly", () => {
        const { getByText } = renderWithProvider(
            <InternalView>
                <Text>Inner content</Text>
            </InternalView>,
        );
        expect(getByText("Inner content")).toBeTruthy();
    });

    it("matches snapshot", () => {
        const { toJSON } = renderWithProvider(
            <InternalView>
                <Text>Snapshot test</Text>
            </InternalView>,
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
