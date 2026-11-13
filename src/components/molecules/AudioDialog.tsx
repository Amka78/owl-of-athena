//#region "Import Modules"
import type { AudioPlayer } from "expo-audio";
import React from "react";
import { StyleSheet, type ViewStyle } from "react-native";
import { Dialog, Portal, RadioButton } from "react-native-paper";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";

import { Colors, Dimens, Fonts, Message, MessageKeys } from "../../constants";
import { AudioList } from "../../sdk/models/AudioList";
import type { AuroraSound } from "../../types";
import { FlatButton } from "../atoms";
import { LabeledRadioButton } from "../molecules";

//#endregion

export { AudioList };

/** paper の Modal は SafeArea インセットを余白に足すため、モーダル領域ではインセットを 0 にする。 */
const zeroInsets = { top: 0, left: 0, right: 0, bottom: 0 };

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
    dialogContainer?: ViewStyle;
};

type AudioDialogState = {
    dialogSettings?: AudioDialogSettings;
    selectedShowName: AudioList;
    selectedFileName: string;
};

export class AudioDialog extends React.Component<AudioDialogProps, AudioDialogState> {
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

    private sound?: AudioPlayer;

    public static show(args: AudioDialogSettings, selectedSound: AudioList): void {
        const foundAudio = AudioDialog.Instance!.findAudio(
            selectedSound === AudioList.NONE ? AudioList.A_NEY_DAY : selectedSound,
        );

        AudioDialog.Instance!.setState({
            dialogSettings: args,
            selectedFileName: foundAudio!.fileName,
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

    public render(): React.ReactNode {
        let width = this.props.dialogContainer?.width;
        if (width && typeof width === "number" && width > Dimens.inner_screen_max_width) {
            width = Dimens.inner_screen_max_width;
        } else if (width && typeof width === "number") {
            width = width - Dimens.content_margin_horizontal * 2;
        }
        return this.state.dialogSettings !== undefined ? (
            // Portal でモーダルをアプリ最上位にホストし、背面の曇りを画面全域（ステータスバー等を含む）に効かせる。
            // paper の Modal は SafeArea インセットを余白に足すため、SafeAreaView 配下のアプリでそのまま
            // Portal 化するとモーダルが下にずれる。モーダルは全画面に描画されるのでインセット 0 で上書きする。
            <Portal>
                <SafeAreaInsetsContext.Provider value={zeroInsets}>
                    <Dialog
                        visible={true}
                        onDismiss={this.onDialogDismissed()}
                        style={[styles.dialogContainer, this.props.dialogContainer, { width }]}
                    >
                        <Dialog.Title style={styles.dialogTitle}>
                            {Message.get(MessageKeys.alarm_sound_dialog_title)}
                        </Dialog.Title>
                        <Dialog.Content style={styles.audioRadioButtonList}>
                            <RadioButton.Group
                                onValueChange={this.onRadioButtonSelected()}
                                value={this.getSelectedAudio()}
                            >
                                {this.soundList.map((value: AudioType, index: number) => {
                                    return (
                                        <LabeledRadioButton
                                            key={index}
                                            value={value.showName}
                                            label={Message.get(value.showName)}
                                            onLabelPress={this.onLabelPressed(value)}
                                        ></LabeledRadioButton>
                                    );
                                })}
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
                </SafeAreaInsetsContext.Provider>
            </Portal>
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
                this.state.selectedFileName,
            );
            this.setState({ dialogSettings: undefined });
        };
    }

    private onLabelPressed(value: AudioType): () => void {
        return async (): Promise<void> => {
            await this.stopSound(this.sound);
            this.sound = this.props.auroraSoundList.find((sound: AuroraSound) => {
                return sound.fileName == value.fileName;
            })!.sound;

            await this.sound.seekTo(0);
            this.sound.play();
        };
    }

    private onDialogClose(): void {
        if (this.state.dialogSettings!.onDissmiss) {
            this.state.dialogSettings!.onDissmiss();
        }
        this.setState({ dialogSettings: undefined });
    }

    private async stopSound(sound?: AudioPlayer): Promise<void> {
        if (sound === undefined || !sound.playing) return;
        sound.pause();
        await sound.seekTo(0);
    }
}

const styles = StyleSheet.create({
    audioRadioButtonList: {
        // `flex: 1` は Content が行の自然高さ（7×40px）に足りず Actions と高さを分け合って
        // 行がタイトルと重なったりボタン下に余白が出るため使わない。
        alignItems: "flex-start",
        justifyContent: "center",
    },
    dialogContainer: {
        alignSelf: "center",
        backgroundColor: Colors.navy_darker,
    },
    dialogTitle: {
        color: Colors.cyan,
        fontFamily: Fonts.primarySemiBold,
    },
    dialogButton: { color: Colors.cyan },
});
