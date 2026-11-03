//#region Inport modules
import React, { type FunctionComponent } from "react";
import { TextInput, type TextStyle, View, type ViewStyle } from "react-native";
import { IconButton } from "react-native-paper";

import { Colors, Message, MessageKeys } from "../../constants";
import { useScreenDimensions } from "../../hooks";
import { StandardView } from "../atoms";
//#endregion

//#region Types
export type ProfilePreviewTemplateProps = {
    content: string;
    onExportPress: () => void;
};
//#endregion

//#region Component
export const ProfilePreviewScreenTemplate: FunctionComponent<ProfilePreviewTemplateProps> = (
    props: ProfilePreviewTemplateProps,
) => {
    const screenDimens = useScreenDimensions();
    return (
        <StandardView standardViewStyle={profilePreviewView} onLayout={screenDimens.onLayout}>
            <View style={[toolbarStyle, { width: screenDimens.width }]}>
                <IconButton
                    icon={"share-variant"}
                    size={24}
                    iconColor={Colors.white}
                    accessibilityLabel={Message.get(MessageKeys.profile_export_button)}
                    onPress={props.onExportPress}
                ></IconButton>
            </View>
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
const toolbarStyle: ViewStyle = {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
};
const defaultTextareaStyle: TextStyle = {
    color: Colors.white,
    flex: 1,
    alignSelf: "stretch",
    fontSize: 18,
    lineHeight: 18,
};
//#endregion
