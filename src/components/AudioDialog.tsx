//#region "Import Modules"
import { Audio } from "expo-av";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { Dialog, RadioButton } from "react-native-paper";

import { Colors, Fonts, Message, MessageKeys } from "../constants";
import { AuroraSound } from "../types";
import { FlatButton } from "./atoms/FlatButton";
import { LabeledRadioButton } from "./molecules/LabeledRadioButton";
//#endregion

type AudioDialogSettings = {
    onConfirm: (showName: AudioList, fileName: string) => void;
    onDissmiss?: () => void;
};

type AudioType = {
    showName: AudioList;
    fileName: string;
};

type AudioDialogProps = {
    auroraSoundList: Array<AuroraSound>;
};

type AudioDialogState = {
    dialogSettings?: AudioDialogSettings;
    selectedShowName: AudioList;
    selectedFileName: string;
};

export enum AudioList {
    NONE = "None",
    A_NEY_DAY = "A New Day",
    BUGLE_CALL = "Bugle Call",
    CLASSIC = "Classic",
    CREATION = "Creation",
    EPIC = "Epic",
    GREEN_GARDEN = "Green Garden",
    SINGING_BIRDS = "Singing Birds",
}

export class AudioDialog extends React.Component<
    AudioDialogProps,
    AudioDialogState
> {
    public static Instance?: AudioDialog;
    private soundList: Array<AudioType> = [
        { showName: AudioList.A_NEY_DAY, fileName: "a_new_day.m4a" },
        { showName: AudioList.BUGLE_CALL, fileName: "bugle_call.m4a" },
        { showName: AudioList.CLASSIC, fileName: "classic.m4a" },
        { showName: AudioList.CREATION, fileName: "creation.m4a" },
        { showName: AudioList.EPIC, fileName: "epic.m4a" },
        { showName: AudioList.GREEN_GARDEN, fileName: "green_garden.m4a" },
        { showName: AudioList.SINGING_BIRDS, fileName: "singing_birds.m4a" },
    ];

    private sound = new Audio.Sound();

    public static show(
        args: AudioDialogSettings,
        selectedSound: AudioList
    ): void {
        const foundAudio = AudioDialog.Instance!.findAudio(
            selectedSound === AudioList.NONE
                ? AudioList.A_NEY_DAY
                : selectedSound
        );

        AudioDialog.Instance!.setState({
            dialogSettings: args,
            selectedFileName: foundAudio!.fileName!,
            selectedShowName: foundAudio!.showName,
        });
    }

    constructor(props: AudioDialogProps) {
        super(props);
        this.state = {
            dialogSettings: undefined,
            selectedShowName: AudioList.NONE,
            selectedFileName: "",
        };
    }

    public async componentDidMount(): Promise<void> {
        AudioDialog.Instance = this;
        this.setState({
            dialogSettings: undefined,
            selectedShowName: AudioList.NONE,
            selectedFileName: "",
        });
    }

    public findAudio(value: string): AudioType | undefined {
        return this.soundList.find((sound: AudioType) => {
            return sound.showName == value;
        });
    }

    public render(): JSX.Element | null {
        return this.state.dialogSettings !== undefined ? (
            <Dialog
                visible={true}
                onDismiss={this.onDialogDismissed()}
                style={styles.dialogContainer}
            >
                <Dialog.Title style={styles.dialogTitle}>
                    {Message.get(MessageKeys.alarm_sound_dialog_title)}
                </Dialog.Title>
                <Dialog.Content style={styles.audioRadioButtonList}>
                    <RadioButton.Group
                        onValueChange={this.onRadioButtonSelected()}
                        value={this.getSelectedAudio()}
                    >
                        {this.soundList.map(
                            (value: AudioType, index: number) => {
                                return (
                                    <LabeledRadioButton
                                        key={index}
                                        value={value.showName}
                                        label={Message.get(value.showName)}
                                        onLabelPress={this.onLabelPressed(
                                            value
                                        )}
                                    ></LabeledRadioButton>
                                );
                            }
                        )}
                    </RadioButton.Group>
                </Dialog.Content>
                <Dialog.Actions>
                    <FlatButton
                        labelStyle={styles.dialogButton}
                        onPress={this.onCancelButtonPressed()}
                    >
                        {Message.get(MessageKeys.cancel)}
                    </FlatButton>
                    <FlatButton
                        labelStyle={styles.dialogButton}
                        onPress={this.onConfirmButtonPressed()}
                    >
                        {Message.get(MessageKeys.save)}
                    </FlatButton>
                </Dialog.Actions>
            </Dialog>
        ) : null;
    }

    private onDialogDismissed(): () => void {
        return async (): Promise<void> => {
            await this.stopSound(this.sound);
            this.onDialogClose();
        };
    }

    private onRadioButtonSelected(): (value: string) => void {
        return (value: string): void => {
            const selectedSound = this.findAudio(value);
            this.setState({
                selectedShowName: selectedSound!.showName,
                selectedFileName: selectedSound!.fileName,
            });
        };
    }

    private getSelectedAudio(): string {
        return this.state.selectedShowName === AudioList.NONE
            ? AudioList.A_NEY_DAY
            : this.state.selectedShowName;
    }

    /**
     * Cancel Button Event Hadler
     *
     * @private
     * @returns {() => void}
     * @memberof AudioDialog
     */
    private onCancelButtonPressed(): () => void {
        return async (): Promise<void> => {
            await this.stopSound(this.sound);
            this.onDialogClose();
        };
    }

    /**
     * Confirm Button Event Handler
     *
     * @private
     * @returns {() => void}
     * @memberof AudioDialog
     */
    private onConfirmButtonPressed(): () => void {
        return async (): Promise<void> => {
            await this.stopSound(this.sound);
            this.state.dialogSettings!.onConfirm(
                this.state.selectedShowName,
                this.state.selectedFileName
            );
            this.setState({ dialogSettings: undefined });
        };
    }

    private onLabelPressed(value: AudioType): () => void {
        return async (): Promise<void> => {
            await this.stopSound(this.sound);
            this.sound = this.props.auroraSoundList.find(
                (sound: AuroraSound) => {
                    return sound.fileName == value.fileName;
                }
            )!.sound;

            await this.sound.playAsync();
        };
    }

    private onDialogClose(): void {
        if (this.state.dialogSettings!.onDissmiss) {
            this.state.dialogSettings!.onDissmiss();
        }
        this.setState({ dialogSettings: undefined });
    }

    private async stopSound(sound: Audio.Sound): Promise<void> {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
            await sound.stopAsync();
        }
    }
}

const styles = StyleSheet.create({
    audioRadioButtonList: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    dialogContainer: {
        backgroundColor: Colors.navy_darker,
        height: Platform.OS !== "web" ? "70%" : undefined,
    },
    dialogTitle: {
        color: Colors.cyan,
        fontFamily: Fonts.primarySemiBold,
    },
    dialogButton: { color: Colors.cyan },
});
