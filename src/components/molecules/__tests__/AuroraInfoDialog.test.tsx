import { act, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { AuroraOSInfo } from "../../../sdk/models";
import { AuroraInfoDialog } from "../AuroraInfoDialog";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("AuroraInfoDialog UnitTest", () => {
    it("shows the build date, running time and free storage", async () => {
        const osInfo = new AuroraOSInfo({
            version: 10001,
            bootloaderVersion: 1,
            bleVersion: 2,
            bootstrapVersion: 3,
            batteryLevel: 87,
            buildDate: Date.UTC(2017, 0, 1, 5, 5, 5),
            bytesFree: 5555,
            runningTime: "5.20 h",
        });
        const { getByText } = renderWithProvider(<AuroraInfoDialog />);

        await act(async () => {
            AuroraInfoDialog.show({ osInfo });
        });

        expect(getByText("Build Date")).toBeTruthy();
        expect(getByText("2017-01-01 05:05 UTC")).toBeTruthy();
        expect(getByText("Running Time")).toBeTruthy();
        expect(getByText("5.20 h")).toBeTruthy();
        expect(getByText("Free Storage")).toBeTruthy();
        expect(getByText("5.4 KB")).toBeTruthy();
    });

    it("shows a dash when the optional fields are missing", async () => {
        const osInfo = new AuroraOSInfo({ version: 10001 });
        const { getAllByText } = renderWithProvider(<AuroraInfoDialog />);

        await act(async () => {
            AuroraInfoDialog.show({ osInfo });
        });

        expect(getAllByText("—").length).toBe(3);
    });
});
