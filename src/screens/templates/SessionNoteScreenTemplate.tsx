//#region Inport modules
import React, { FunctionComponent } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

import { StandardView } from "../../components";
import { Colors } from "../../constants";
import { useSessionNote } from "../../hooks/useSessionNote";
//#endregion

//#region Types
export type SessionNoteTemplateProps = Pick<
    TextInputProps,
    "onBlur" | "defaultValue" | "value" | "onChangeText"
>;
//#endregion

//#region Component
export const SessionNoteScreenTemplate: FunctionComponent<SessionNoteTemplateProps> = (
    props: SessionNoteTemplateProps
) => {
    const sessionNoteHook = useSessionNote();
    return (
        <StandardView standardViewStyle={styles.sessionNoteView}>
            <TextInput
                {...props}
                style={styles.defaultTextareaStyle}
                defaultValue={sessionNoteHook.notes}
                multiline={true}
            />
        </StandardView>
    );
};
//#endregion

//#region Style
const styles = StyleSheet.create({
    sessionNoteView: { marginLeft: 0, marginRight: 0 },
    defaultTextareaStyle: {
        color: Colors.white,
        flex: 1,
        alignSelf: "stretch",
        fontSize: 18,
        lineHeight: 18,
    },
});
//#endregion
