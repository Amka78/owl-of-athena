//#region Import Modules

import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { TimeView } from "../TimeView";

//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe("TimeView UnitTest", () => {
    it('renders correctly with mode="meridian"', () => {
        const { toJSON } = renderWithProvider(<TimeView mode="meridian" hours={8} minutes={30} />);
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly with mode="time"', () => {
        const { toJSON } = renderWithProvider(<TimeView mode="time" hours={2} minutes={15} />);
        expect(toJSON()).toMatchSnapshot();
    });
});
//#endregion
