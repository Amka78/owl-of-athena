//#region Inport modules
import React, { FunctionComponent, useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { StandardView } from "../components";
import { useCheckLogging, useSelectedSessionSelector } from "../hooks";
import { Colors } from "../constants";
import { SessionRestClientInstance } from "../clients";
import { useDispatch } from "react-redux";
import { updateSession } from "../actions/SessionsActions";
//#endregion

//#region Component
export const SessionNotesScreen: FunctionComponent = () => {
    useCheckLogging();

    const dispatch = useDispatch();
    const selectedSession = useSelectedSessionSelector();
    const [notes, setNotes] = useState(selectedSession!.notes);

    return (
        <StandardView standardViewStyle={{ marginLeft: 0, marginRight: 0 }}>
            <TextInput
                onBlur={(): void => {
                    if (notes !== selectedSession!.notes) {
                        SessionRestClientInstance.updateById(
                            selectedSession!.id,
                            { notes }
                        );
                        selectedSession!.notes = notes;
                        dispatch(updateSession(selectedSession!));
                    }
                }}
                style={style.defaultTextareaStyle}
                defaultValue={notes}
                multiline={true}
                value={notes}
                onChangeText={(value: string): void => {
                    setNotes(value);
                }}
            />
        </StandardView>
    );
};
//#endregion

//#region Style
const style = StyleSheet.create({
    defaultTextareaStyle: {
        color: Colors.white,
        flex: 1,
        alignSelf: "stretch",
        fontSize: 18,
        lineHeight: 18,
    },
});
//#endregion
