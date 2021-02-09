import React from "react";
import { View, StyleSheet } from "react-native";
import { Message, MessageKeys, Colors, Fonts } from "../constants";

import { Dialog, RadioButton } from "react-native-paper";
import { LabeledRadioButton } from "./molecules/LabeledRadioButton";
import { FlatButton } from "./atoms/FlatButton";
import { AuroraProfile } from "../sdk/AuroraTypes";
type ProfilesDialogSettings = {
    profileList: Array<AuroraProfile>;
    selectedProfileId: string;
    onConfirm: (profileId: string, profileTitle: string) => void;
    onDissmiss?: () => void;
};

type ProfilesDialogState = {
    dialogSettings?: ProfilesDialogSettings;
    selectedProfileId: string;
    selectedProfileTitle: string;
};

export class ProfilesDialog extends React.Component<{}, ProfilesDialogState> {
    public static Instance?: ProfilesDialog;

    public static show(args: ProfilesDialogSettings): void {
        let selectedProfile = args.profileList.find((value: AuroraProfile) => {
            return value.id === args.selectedProfileId;
        });

        if (!selectedProfile) {
            selectedProfile = args.profileList[0];
        }

        this.Instance!.setState({
            dialogSettings: args,
            selectedProfileId: selectedProfile.id!,
            selectedProfileTitle: selectedProfile.title!,
        });
    }

    constructor() {
        super({});

        this.state = {
            selectedProfileId: "",
            selectedProfileTitle: "",
            dialogSettings: undefined,
        };
    }

    public async componentDidMount(): Promise<void> {
        ProfilesDialog.Instance = this;
    }

    private closeDialog(): void {
        if (this.state.dialogSettings!.onDissmiss) {
            this.state.dialogSettings!.onDissmiss!();
        }
        this.setState({ dialogSettings: undefined });
    }

    public render(): JSX.Element | null {
        return this.state.dialogSettings ? (
            <Dialog
                visible={true}
                onDismiss={async (): Promise<void> => {
                    this.closeDialog();
                }}
                style={style.dialogContainer}
            >
                <Dialog.Title style={style.dialogTitle}>
                    {Message.get(MessageKeys.profile_dialog_title)}
                </Dialog.Title>
                <Dialog.Content>
                    <RadioButton.Group
                        onValueChange={this.onRadioButtonSelected()}
                        value={this.getSelectedProfile()}
                    >
                        <View style={style.profileRadioButtonList}>
                            {this.state.dialogSettings.profileList.map(
                                (value: AuroraProfile, index: number) => {
                                    return (
                                        <LabeledRadioButton
                                            key={index}
                                            value={value.title!}
                                            label={{ key: value.title! }}
                                        ></LabeledRadioButton>
                                    );
                                }
                            )}
                        </View>
                    </RadioButton.Group>
                </Dialog.Content>
                <Dialog.Actions>
                    <FlatButton
                        labelStyle={style.dialogButton}
                        onPress={this.onCancelButtonPressed()}
                    >
                        {{ key: MessageKeys.cancel }}
                    </FlatButton>
                    <FlatButton
                        labelStyle={style.dialogButton}
                        onPress={this.onCofirmButtonPressed()}
                    >
                        {{ key: MessageKeys.save }}
                    </FlatButton>
                </Dialog.Actions>
            </Dialog>
        ) : null;
    }

    private onRadioButtonSelected(): (value: string) => void {
        return (value: string): void => {
            const selectedProfile = this.state.dialogSettings!.profileList.find(
                (profile: AuroraProfile) => {
                    return profile.title! == value;
                }
            );
            this.setState({
                selectedProfileId: selectedProfile!.id!,
                selectedProfileTitle: selectedProfile!.title!,
            });
        };
    }

    private getSelectedProfile(): string {
        return this.state.selectedProfileTitle === ""
            ? this.state.dialogSettings!.profileList[0].title!
            : this.state.selectedProfileTitle;
    }

    private onCancelButtonPressed(): () => void {
        return async (): Promise<void> => {
            this.closeDialog();
        };
    }

    private onCofirmButtonPressed(): () => void {
        return async (): Promise<void> => {
            this.state.dialogSettings!.onConfirm(
                this.state.selectedProfileId,
                this.state.selectedProfileTitle
            );
            this.setState({ dialogSettings: undefined });
        };
    }
}

const style = StyleSheet.create({
    dialogContainer: {
        backgroundColor: Colors.navy_darker,
    },
    dialogTitle: {
        color: Colors.cyan,
        fontFamily: Fonts.primarySemiBold,
    },
    profileRadioButtonList: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    dialogButton: { color: Colors.cyan },
});
