import { render } from "@testing-library/react-native";
import type React from "react";
import { Text } from "react-native";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { ConvertibleListForm } from "../ConvertibleListForm";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("ConvertibleListForm", () => {
    it("renders correctly with all props", () => {
        const { toJSON } = renderWithProvider(
            <ConvertibleListForm
                listMenu={[<Text key="1">Menu Item</Text>]}
                listScreen={<Text>List Content</Text>}
                itemScreen={<Text>Item Content</Text>}
            />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders list menu items", () => {
        const { getByText } = renderWithProvider(
            <ConvertibleListForm
                listMenu={[<Text key="1">Menu Item</Text>]}
                listScreen={<Text>List Content</Text>}
                itemScreen={<Text>Detail</Text>}
            />,
        );
        expect(getByText("Menu Item")).toBeTruthy();
        expect(getByText("List Content")).toBeTruthy();
        expect(getByText("Detail")).toBeTruthy();
    });

    it("renders without optional props", () => {
        const { toJSON } = renderWithProvider(<ConvertibleListForm />);
        expect(toJSON()).toBeTruthy();
    });
});
