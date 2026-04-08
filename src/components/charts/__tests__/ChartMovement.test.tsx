import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import type { AuroraEvent } from "../../../sdk/models";
import { ChartMovement } from "../ChartMovement";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const now = Date.now();

const sampleMovement: AuroraEvent[] = [
    { auroraEventId: 1, bins: [], eventAt: now - 3600000, flags: 1, id: 1, time: 0 } as AuroraEvent,
    {
        auroraEventId: 2,
        bins: [],
        eventAt: now - 2700000,
        flags: 2,
        id: 2,
        time: 900000,
    } as AuroraEvent,
    {
        auroraEventId: 3,
        bins: [],
        eventAt: now - 1800000,
        flags: 1,
        id: 3,
        time: 1800000,
    } as AuroraEvent,
];

const defaultProps = {
    width: 400,
    height: 80,
    movement: sampleMovement,
    xScaleDomain: [now - 3600000, now],
    dataBins: [] as number[],
    dataBinThreshold: 16,
};

describe("ChartMovement UnitTest", () => {
    // ChartMovement uses ClippedG which generates a random clipPath ID each render,
    // so we verify rendering without crashing rather than using snapshots.
    it("renders without crashing with movement data", () => {
        expect(() => renderWithProvider(<ChartMovement {...defaultProps} />)).not.toThrow();
    });

    it("renders without crashing with empty movement data", () => {
        expect(() =>
            renderWithProvider(<ChartMovement {...defaultProps} movement={[]} />),
        ).not.toThrow();
    });

    it("renders without crashing with custom tick color", () => {
        expect(() =>
            renderWithProvider(<ChartMovement {...defaultProps} movementTickColor="#ff0000" />),
        ).not.toThrow();
    });

    it("renders without crashing with custom label color", () => {
        expect(() =>
            renderWithProvider(<ChartMovement {...defaultProps} movementLabelColor="#cccccc" />),
        ).not.toThrow();
    });

    it("renders a non-null tree", () => {
        const { toJSON } = renderWithProvider(<ChartMovement {...defaultProps} />);
        expect(toJSON()).not.toBeNull();
    });
});
