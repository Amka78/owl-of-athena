//#region Inport modules
import React, { FunctionComponent } from "react";
import { TextInput, TextStyle, ViewStyle } from "react-native";

import { Colors } from "../../constants";
import { useScreenDimensions } from "../../hooks";
import { StandardView } from "../atoms";
//#endregion

//#region Types
export type ProfilePreviewTemplateProps = {
    content: string;
};
//#endregion

//#region Component
export const ProfilePreviewScreenTemplate: FunctionComponent<ProfilePreviewTemplateProps> = (
    props: ProfilePreviewTemplateProps
) => {
    const screenDimens = useScreenDimensions();
    return (
        <StandardView
            standardViewStyle={profilePreviewView}
            onLayout={screenDimens.onLayout}
        >
            <TextInput
                value={props.content}
                style={[defaultTextareaStyle, { width: screenDimens.width }]}
                multiline={true}
            />
        </StandardView>
    );
};
//#endregion

//#region Style
const profilePreviewView: ViewStyle = { marginLeft: 0, marginRight: 0 };
const defaultTextareaStyle: TextStyle = {
    color: Colors.white,
    flex: 1,
    alignSelf: "stretch",
    fontSize: 18,
    lineHeight: 18,
};
//#endregion
