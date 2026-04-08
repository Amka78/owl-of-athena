//#region Import Modules
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dialog } from "react-native-paper";

import { Colors, Dimens, Fonts, Message, MessageKeys } from "../../constants";
import type { AuroraProfile } from "../../sdk/AuroraTypes";
import { useProfileStore } from "../../store/profileStore";
import { FlatButton } from "../atoms";
import { ValidatableTextBox } from "./ValidatableTextBox";
//#endregion

//#region Types
type ProfileEditDialogSettings = {
    profile: AuroraProfile;
    onSave?: () => void;
};

type ProfileEditDialogState = {
    settings?: ProfileEditDialogSettings;
    title: string;
    description: string;
};
//#endregion

//#region Component
export class ProfileEditDialog extends React.Component<{}, ProfileEditDialogState> {
    public static Instance?: ProfileEditDialog;

    public static show(args: ProfileEditDialogSettings): void {
        ProfileEditDialog.Instance!.setState({
            settings: args,
            title: args.profile.title ?? "",
            description: args.profile.description ?? "",
        });
    }

    constructor(props: {}) {
        super(props);
        this.state = {
            settings: undefined,
            title: "",
            description: "",
        };
    }

    public async componentDidMount(): Promise<void> {
        ProfileEditDialog.Instance = this;
    }

    private close(): void {
        this.setState({ settings: undefined, title: "", description: "" });
    }

    private async save(): Promise<void> {
        const { settings, title, description } = this.state;
        if (!settings) return;

        const updatedProfile: AuroraProfile = {
            ...settings.profile,
            title,
            description,
        };

        useProfileStore.getState().updateProfile(updatedProfile);
        settings.onSave?.();
        this.close();
    }

    public render(): React.ReactNode {
        if (!this.state.settings) return null;

        return (
            <Dialog
                visible={true}
                onDismiss={() => this.close()}
                style={styles.dialog}
            >
                <Dialog.Title style={styles.dialogTitle}>
                    {Message.get(MessageKeys.profile_edit_title)}
                </Dialog.Title>
                <Dialog.Content>
                    <View style={styles.content}>
                        <ValidatableTextBox
                            label={Message.get(MessageKeys.profile_edit_input_title)}
                            value={this.state.title}
                            onChangeText={(text) => this.setState({ title: text })}
                        />
                        <ValidatableTextBox
                            label={Message.get(MessageKeys.profile_edit_input_description)}
                            value={this.state.description}
                            onChangeText={(text) => this.setState({ description: text })}
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                </Dialog.Content>
                <Dialog.Actions>
                    <FlatButton
                        labelStyle={styles.cancelButton}
                        onPress={() => this.close()}
                    >
                        {Message.get(MessageKeys.cancel)}
                    </FlatButton>
                    <FlatButton
                        labelStyle={styles.saveButton}
                        onPress={() => this.save()}
                        disabled={!this.state.title.trim()}
                    >
                        {Message.get(MessageKeys.profile_edit_button)}
                    </FlatButton>
                </Dialog.Actions>
            </Dialog>
        );
    }
}
//#endregion

//#region Styles
const styles = StyleSheet.create({
    dialog: {
        backgroundColor: Colors.navy_darker,
        maxWidth: Dimens.inner_screen_max_width,
        alignSelf: "center",
        width: "90%",
    },
    dialogTitle: {
        color: Colors.cyan,
        fontFamily: Fonts.primaryRegular,
    },
    content: {
        gap: 8,
    },
    cancelButton: {
        color: Colors.gray,
    },
    saveButton: {
        color: Colors.first_accent_color,
    },
});
//#endregion
