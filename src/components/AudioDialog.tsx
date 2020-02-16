import React, { FunctionComponent, useState } from "react";
import { View } from "react-native";
import { Message, Colors, Fonts } from "../constants";

import { Dialog, RadioButton } from "react-native-paper";
import { LabeledRadioButton } from "./LabeledRadioButton";
import { FlatButton } from "./FlatButton";
import { Audio } from "expo-av";
type AudioDialogProps = {
    visible: boolean;
    onDissmiss: () => void;
};

type SoundProps = {
    showName: string;
    fileName: string;
};
export const AudioDialog: FunctionComponent<AudioDialogProps> = (
    props: AudioDialogProps
) => {
    const [alarmSound, setAlarmSound] = useState<string>("A New Day");
    const soundList: Array<SoundProps> = [
        { showName: "A New Day", fileName: "a_new_day.m4a" },
        { showName: "Bugle Call", fileName: "bugle_call.m4a" },
        { showName: "Classic", fileName: "classic.m4a" },
        { showName: "Creation", fileName: "creation.m4a" },
        { showName: "Epic", fileName: "epic.m4a" },
        { showName: "Green Garden", fileName: "green_garden.m4a" },
        { showName: "Singing Birds", fileName: "singing_birds.m4a" }
    ];

    let sound = new Audio.Sound();
    return (
        <Dialog
            visible={props.visible}
            onDismiss={async (): Promise<void> => {
                await stopSound(sound);
                props.onDissmiss();
            }}
            style={{
                backgroundColor: Colors.navy_darker
            }}
        >
            <Dialog.Title
                style={{
                    color: Colors.cyan,
                    fontFamily: Fonts.primarySemiBold
                }}
            >
                {Message.get("alarm_sound_dialog_title")}
            </Dialog.Title>
            <Dialog.Content>
                <RadioButton.Group
                    onValueChange={(value: string): void => {
                        setAlarmSound(value);
                    }}
                    value={alarmSound}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: "flex-start",
                            justifyContent: "center"
                        }}
                    >
                        {soundList.map((value: SoundProps, index: number) => {
                            return (
                                <LabeledRadioButton
                                    key={index}
                                    value={value.showName}
                                    label={value.showName}
                                    onLabelPress={async (): Promise<void> => {
                                        await stopSound(sound);

                                        sound = new Audio.Sound();
                                        await sound.loadAsync(
                                            // eslint-disable-next-line @typescript-eslint/no-var-requires
                                            require(`../../assets/audio/${value.fileName}`)
                                        );
                                        await sound.playAsync();
                                    }}
                                ></LabeledRadioButton>
                            );
                        })}
                    </View>
                </RadioButton.Group>
            </Dialog.Content>
            <Dialog.Actions>
                <FlatButton
                    labelStyle={{ color: Colors.cyan }}
                    onPress={async (): Promise<void> => {
                        await stopSound(sound);
                        props.onDissmiss();
                    }}
                >
                    {"cancel"}
                </FlatButton>
                <FlatButton labelStyle={{ color: Colors.cyan }}>
                    {"save"}
                </FlatButton>
            </Dialog.Actions>
        </Dialog>
    );
};
async function stopSound(sound: Audio.Sound) {
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
        await sound.stopAsync();
    }
}
