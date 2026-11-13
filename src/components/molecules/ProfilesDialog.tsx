import React from "react";
import { StyleSheet, View } from "react-native";
import { Dialog, Portal, RadioButton } from "react-native-paper";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { Colors, Fonts, Message, MessageKeys } from "../../constants";
import type { AuroraProfile } from "../../sdk/AuroraTypes";
import { FlatButton } from "../atoms";
import { LabeledRadioButton } from "./LabeledRadioButton";

type ProfilesDialogSettings = {
    profileList: Array<AuroraProfile>;
    selectedProfileId: string;
    onConfirm: (profileId: string, profileTitle: string) => void;
    onDissmiss?: () => void;
};

/** paper の Modal は SafeArea インセットを余白に足すため、モーダル領域ではインセットを 0 にする。 */
const zeroInsets = { top: 0, left: 0, right: 0, bottom: 0 };

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

        ProfilesDialog.Instance!.setState({
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
            this.state.dialogSettings!.onDissmiss();
        }
        this.setState({ dialogSettings: undefined });
    }

    public render(): React.ReactNode {
        return this.state.dialogSettings ? (
            // Portal でモーダルをアプリ最上位にホストし、背面の曇りを画面全域に効かせる。
            // paper の Modal は SafeArea インセットを余白に足すため下にずれるので、インセット 0 で上書きする。
            <Portal>
                <SafeAreaInsetsContext.Provider value={zeroInsets}>
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
                                                    key={value.id ?? value.title ?? index}
                                                    value={value.title!}
                                                    label={value.title!}
                                                ></LabeledRadioButton>
                                            );
                                        },
                                    )}
                                </View>
                            </RadioButton.Group>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <FlatButton
                                labelStyle={style.dialogButton}
                                onPress={this.onCancelButtonPressed()}
                            >
                                {Message.get(MessageKeys.cancel)}
                            </FlatButton>
                            <FlatButton
                                labelStyle={style.dialogButton}
                                onPress={this.onCofirmButtonPressed()}
                            >
                                {Message.get(MessageKeys.save)}
                            </FlatButton>
                        </Dialog.Actions>
                    </Dialog>
                </SafeAreaInsetsContext.Provider>
            </Portal>
        ) : null;
    }

    private onRadioButtonSelected(): (value: string) => void {
        return (value: string): void => {
            const selectedProfile = this.state.dialogSettings!.profileList.find(
                (profile: AuroraProfile) => {
                    return profile.title! === value;
                },
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
                this.state.selectedProfileTitle,
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
        // `flex: 1` は高さ不定の列で行を高さ 0 に潰すため使わない（LabeledRadioButton と同じ理由）。
        alignItems: "flex-start",
        justifyContent: "center",
    },
    dialogButton: { color: Colors.cyan },
});
