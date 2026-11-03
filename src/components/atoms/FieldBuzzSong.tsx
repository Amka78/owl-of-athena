//#region Import Modules
import { Picker } from "@react-native-picker/picker";
import React, { type FunctionComponent } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors, Dimens, Fonts, Message, MessageKeys } from "../../constants";
import { BuzzerSongs } from "../../sdk/AuroraConstants";
import type { SongValue } from "../../sdk/AuroraTypes";
import { BUZZ_SONG_DEFAULTS } from "../../services/ProfileService";
import { LabeledSlider } from "../molecules/LabeledSlider";
import { FlatButton } from "./FlatButton";
//#endregion

//#region Types
export type FieldBuzzSongProps = {
    value?: SongValue | string;
    disabled: boolean;
    onPreviewSongPress: (value: SongValue) => void;
    onValueChange: (value: SongValue) => void;
};
//#endregion

//#region Component
export const FieldBuzzSong: FunctionComponent<FieldBuzzSongProps> = (props: FieldBuzzSongProps) => {
    const value = normalizeValue(props.value);

    const update = (change: Partial<SongValue>): void => {
        props.onValueChange({ ...BUZZ_SONG_DEFAULTS, ...value, ...change });
    };

    const onChangeSong = (song: string): void => {
        if (!song) {
            props.onValueChange({});
            return;
        }

        props.onValueChange({ ...BUZZ_SONG_DEFAULTS, song });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{Message.get(MessageKeys.buzz_song_choose)}</Text>
            <View style={styles.songRow}>
                <Picker
                    selectedValue={value.song ?? ""}
                    enabled={!props.disabled}
                    style={styles.picker}
                    onValueChange={(song: string | number): void => onChangeSong(String(song))}
                >
                    <Picker.Item
                        value={""}
                        label={Message.get(MessageKeys.buzz_song_none)}
                    ></Picker.Item>
                    {BuzzerSongs.map((song) => (
                        <Picker.Item
                            key={song.file}
                            value={song.file}
                            label={song.title}
                        ></Picker.Item>
                    ))}
                </Picker>
                {value.song && !props.disabled && (
                    <FlatButton onPress={(): void => props.onPreviewSongPress(value)}>
                        {Message.get(MessageKeys.buzz_song_preview)}
                    </FlatButton>
                )}
            </View>

            {value.song && (
                <View>
                    <LabeledSlider
                        label={Message.get(MessageKeys.buzz_song_repeat)}
                        value={value.repeat ?? BUZZ_SONG_DEFAULTS.repeat}
                        min={0}
                        max={20}
                        step={1}
                        disabled={props.disabled}
                        onValueChange={(repeat): void => update({ repeat })}
                    ></LabeledSlider>
                    <LabeledSlider
                        label={Message.get(MessageKeys.buzz_song_volume)}
                        value={value.volume ?? BUZZ_SONG_DEFAULTS.volume}
                        min={0}
                        max={100}
                        step={1}
                        disabled={props.disabled}
                        formatValue={(volume): string => `${volume}%`}
                        onValueChange={(volume): void => update({ volume })}
                    ></LabeledSlider>
                    <LabeledSlider
                        label={Message.get(MessageKeys.buzz_song_tempo)}
                        value={value.tempoAdjust ?? BUZZ_SONG_DEFAULTS.tempoAdjust}
                        min={0.25}
                        max={2.5}
                        step={0.25}
                        disabled={props.disabled}
                        formatValue={(tempo): string => `${tempo.toFixed(2)}x`}
                        onValueChange={(tempoAdjust): void => update({ tempoAdjust })}
                    ></LabeledSlider>
                    <LabeledSlider
                        label={Message.get(MessageKeys.buzz_song_pitch)}
                        value={value.pitchAdjust ?? BUZZ_SONG_DEFAULTS.pitchAdjust}
                        min={-12}
                        max={12}
                        step={1}
                        disabled={props.disabled}
                        formatValue={(pitch): string => `${pitch > 0 ? "+" : ""}${pitch}`}
                        onValueChange={(pitchAdjust): void => update({ pitchAdjust })}
                    ></LabeledSlider>
                </View>
            )}
        </View>
    );
};

const normalizeValue = (value: FieldBuzzSongProps["value"]): SongValue => {
    if (!value) return {};
    if (typeof value === "string") return value ? { song: value } : {};
    return value;
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: 8,
        paddingBottom: 8,
    },
    label: {
        color: Colors.cyan,
        fontFamily: Fonts.primaryRegular,
        fontSize: Dimens.option_text_size,
        marginBottom: 4,
    },
    songRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    picker: {
        flex: 1,
        backgroundColor: Colors.purple,
        color: Colors.white,
    },
});
//#endregion
