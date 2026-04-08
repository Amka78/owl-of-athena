import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { XAxisBottomLine } from "../XAxisBottomLine";
import { XAxisTopLine } from "../XAxisTopLine";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("XAxisBottomLine UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(
            <XAxisBottomLine width={400} height={200} color="#ffffff" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders with different dimensions", () => {
        const { toJSON } = renderWithProvider(
            <XAxisBottomLine width={600} height={100} color="#aaaaaa" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });
});

describe("XAxisTopLine UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<XAxisTopLine width={400} color="#ffffff" />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders with different width and color", () => {
        const { toJSON } = renderWithProvider(<XAxisTopLine width={800} color="#cccccc" />);
        expect(toJSON()).toMatchSnapshot();
    });
});
