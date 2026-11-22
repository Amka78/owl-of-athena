//#region Import Modules
import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { FieldBuzzSong } from "../FieldBuzzSong";

//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const song = {
    song: "a_new_day.m4a",
    repeat: 2,
    volume: 50,
    tempoAdjust: 1.5,
    pitchAdjust: 3,
};

//#region Tests
describe("FieldBuzzSong UnitTest", () => {
    it("renders the selected song parameters", () => {
        const { getByText } = renderWithProvider(
            <FieldBuzzSong
                value={song}
                disabled={false}
                onPreviewSongPress={vi.fn()}
                onValueChange={vi.fn()}
            />,
        );

        expect(getByText("Repeat")).toBeTruthy();
        expect(getByText("Volume")).toBeTruthy();
        expect(getByText("Tempo")).toBeTruthy();
        expect(getByText("Pitch")).toBeTruthy();
        expect(getByText("50%")).toBeTruthy();
    });

    it("hides parameters when no song is selected", () => {
        const { queryByText } = renderWithProvider(
            <FieldBuzzSong
                value={{}}
                disabled={false}
                onPreviewSongPress={vi.fn()}
                onValueChange={vi.fn()}
            />,
        );

        expect(queryByText("Repeat")).toBeNull();
    });

    it("calls onPreviewSongPress with the current value", () => {
        const onPreviewSongPress = vi.fn();
        const { getByText } = renderWithProvider(
            <FieldBuzzSong
                value={song}
                disabled={false}
                onPreviewSongPress={onPreviewSongPress}
                onValueChange={vi.fn()}
            />,
        );

        fireEvent.press(getByText("Preview Song"));
        expect(onPreviewSongPress).toHaveBeenCalledWith(song);
    });
});
//#endregion
