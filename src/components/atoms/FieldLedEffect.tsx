//#region Import Modules
import { Picker } from "@react-native-picker/picker";
import type React from "react";
import type { FunctionComponent } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

import { Colors, Dimens, Fonts, Message, MessageKeys } from "../../constants";
import type { LedEffectName, StimLedValue } from "../../sdk/AuroraTypes";
import { LED_EFFECT_DEFAULTS } from "../../services/ProfileService";
import { LabeledSlider } from "../molecules/LabeledSlider";
import { LedPicker } from "../molecules/LedPicker";
import { FlatButton } from "./FlatButton";
//#endregion

//#region Types
export type FieldLedEffectProps = {
    value?: StimLedValue | string;
    disabled: boolean;
    onPreviewEffectPress: (value: StimLedValue) => void;
    onValueChange: (value: StimLedValue) => void;
};
//#endregion

//#region Component
export const FieldLedEffect: FunctionComponent<FieldLedEffectProps> = (
    props: FieldLedEffectProps,
) => {
    const value = normalizeValue(props.value);
    const effect = value.effect ?? "";

    const update = (change: Partial<StimLedValue>): void => {
        const defaults = value.effect ? LED_EFFECT_DEFAULTS[value.effect] : {};
        props.onValueChange({ ...defaults, ...value, ...change });
    };

    const onChangeEffect = (nextEffect: string): void => {
        if (!nextEffect) {
            props.onValueChange({});
            return;
        }

        props.onValueChange({ ...LED_EFFECT_DEFAULTS[nextEffect as LedEffectName] });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{Message.get(MessageKeys.led_effect_choose)}</Text>
            <View style={styles.effectRow}>
                <Picker
                    selectedValue={effect}
                    enabled={!props.disabled}
                    style={styles.picker}
                    onValueChange={(nextEffect: string | number): void =>
                        onChangeEffect(String(nextEffect))
                    }
                >
                    <Picker.Item
                        value={""}
                        label={Message.get(MessageKeys.no_effect)}
                    ></Picker.Item>
                    <Picker.Item value={"set"} label={Message.get(MessageKeys.set)}></Picker.Item>
                    <Picker.Item
                        value={"blink"}
                        label={Message.get(MessageKeys.blink)}
                    ></Picker.Item>
                    <Picker.Item
                        value={"alternate"}
                        label={Message.get(MessageKeys.alternate)}
                    ></Picker.Item>
                    <Picker.Item
                        value={"transition"}
                        label={Message.get(MessageKeys.transition)}
                    ></Picker.Item>
                </Picker>
                {effect !== "" && !props.disabled && (
                    <FlatButton onPress={(): void => props.onPreviewEffectPress(value)}>
                        {Message.get(MessageKeys.led_effect_preview)}
                    </FlatButton>
                )}
            </View>

            {effect === "set" && (
                <View>
                    <LedPicker
                        value={value}
                        disabled={props.disabled}
                        onValueChange={update}
                    ></LedPicker>
                    {renderShutoffSlider(value, props.disabled, update, 1, 1)}
                </View>
            )}

            {effect === "blink" && (
                <View>
                    <LedPicker
                        value={value}
                        disabled={props.disabled}
                        onValueChange={update}
                    ></LedPicker>
                    <LabeledSlider
                        label={Message.get(MessageKeys.led_blink_count)}
                        value={value.blinkCount ?? 5}
                        min={1}
                        max={100}
                        step={1}
                        disabled={props.disabled}
                        onValueChange={(blinkCount): void => update({ blinkCount })}
                    ></LabeledSlider>
                    <LabeledSlider
                        label={Message.get(MessageKeys.led_blink_rate)}
                        value={value.blinkRate ?? 0.5}
                        min={0.125}
                        max={5}
                        step={0.125}
                        disabled={props.disabled}
                        formatValue={(rate): string => `${rate} Hz`}
                        onValueChange={(blinkRate): void => update({ blinkRate })}
                    ></LabeledSlider>
                    {renderShutoffSlider(value, props.disabled, update, 0, 5)}
                </View>
            )}

            {effect === "alternate" && (
                <View>
                    <LedPicker
                        label={Message.get(MessageKeys.led_state1)}
                        value={{
                            eyes: value.state1Eyes,
                            color: value.state1Color,
                            brightness: value.state1Brightness,
                        }}
                        disabled={props.disabled}
                        onValueChange={(state1): void =>
                            update({
                                state1Eyes: state1.eyes,
                                state1Color: state1.color,
                                state1Brightness: state1.brightness,
                            })
                        }
                    ></LedPicker>
                    <LabeledSlider
                        label={Message.get(MessageKeys.led_state1_duration)}
                        value={value.state1Duration ?? 1}
                        min={0.25}
                        max={5}
                        step={0.25}
                        disabled={props.disabled}
                        formatValue={(duration): string => `${duration} s`}
                        onValueChange={(state1Duration): void => update({ state1Duration })}
                    ></LabeledSlider>
                    <LedPicker
                        label={Message.get(MessageKeys.led_state2)}
                        value={{
                            eyes: value.state2Eyes,
                            color: value.state2Color,
                            brightness: value.state2Brightness,
                        }}
                        disabled={props.disabled}
                        onValueChange={(state2): void =>
                            update({
                                state2Eyes: state2.eyes,
                                state2Color: state2.color,
                                state2Brightness: state2.brightness,
                            })
                        }
                    ></LedPicker>
                    <LabeledSlider
                        label={Message.get(MessageKeys.led_state2_duration)}
                        value={value.state2Duration ?? 0.5}
                        min={0.25}
                        max={5}
                        step={0.25}
                        disabled={props.disabled}
                        formatValue={(duration): string => `${duration} s`}
                        onValueChange={(state2Duration): void => update({ state2Duration })}
                    ></LabeledSlider>
                    <LabeledSlider
                        label={Message.get(MessageKeys.led_alternate_count)}
                        value={value.alternateCount ?? 4}
                        min={1}
                        max={100}
                        step={1}
                        disabled={props.disabled}
                        onValueChange={(alternateCount): void => update({ alternateCount })}
                    ></LabeledSlider>
                    {renderShutoffSlider(value, props.disabled, update, 0, 5)}
                </View>
            )}

            {effect === "transition" && (
                <View>
                    <LedPicker
                        label={Message.get(MessageKeys.led_state1)}
                        value={{
                            eyes: value.state1Eyes,
                            color: value.state1Color,
                            brightness: value.state1Brightness,
                        }}
                        disabled={props.disabled}
                        onValueChange={(state1): void =>
                            update({
                                state1Eyes: state1.eyes,
                                state1Color: state1.color,
                                state1Brightness: state1.brightness,
                            })
                        }
                    ></LedPicker>
                    <LedPicker
                        label={Message.get(MessageKeys.led_state2)}
                        value={{
                            eyes: value.state2Eyes,
                            color: value.state2Color,
                            brightness: value.state2Brightness,
                        }}
                        disabled={props.disabled}
                        onValueChange={(state2): void =>
                            update({
                                state2Eyes: state2.eyes,
                                state2Color: state2.color,
                                state2Brightness: state2.brightness,
                            })
                        }
                    ></LedPicker>
                    <LabeledSlider
                        label={Message.get(MessageKeys.led_transition_duration)}
                        value={value.transitionDuration ?? 5}
                        min={1}
                        max={120}
                        step={1}
                        disabled={props.disabled}
                        formatValue={(duration): string => `${duration} s`}
                        onValueChange={(transitionDuration): void => update({ transitionDuration })}
                    ></LabeledSlider>
                    <View style={styles.toggleRow}>
                        <Text style={styles.toggleLabel}>
                            {Message.get(MessageKeys.led_transition_rewind)}
                        </Text>
                        <Switch
                            value={value.transitionRewind ?? true}
                            disabled={props.disabled}
                            onValueChange={(transitionRewind): void => update({ transitionRewind })}
                        ></Switch>
                    </View>
                    {renderShutoffSlider(value, props.disabled, update, 0, 5)}
                </View>
            )}
        </View>
    );
};

const normalizeValue = (value: FieldLedEffectProps["value"]): StimLedValue => {
    if (!value) return {};
    if (typeof value === "string") {
        return value ? { effect: value as LedEffectName } : {};
    }
    return value;
};

const renderShutoffSlider = (
    value: StimLedValue,
    disabled: boolean,
    update: (change: Partial<StimLedValue>) => void,
    min: number,
    step: number,
): React.ReactNode => {
    const shutoffDelay = value.shutoffDelay === -1 ? 120 : (value.shutoffDelay ?? 0);

    return (
        <LabeledSlider
            label={Message.get(MessageKeys.led_shutoff_delay)}
            value={shutoffDelay}
            min={min}
            max={120}
            step={step}
            disabled={disabled}
            formatValue={(delay): string => (delay === 120 ? "∞" : `${delay} s`)}
            onValueChange={(delay): void => update({ shutoffDelay: delay === 120 ? -1 : delay })}
        ></LabeledSlider>
    );
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
    effectRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    picker: {
        flex: 1,
        backgroundColor: Colors.purple,
        color: Colors.white,
    },
    toggleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: Dimens.option_margin_bottom,
    },
    toggleLabel: {
        color: Colors.cyan,
        fontFamily: Fonts.primaryRegular,
        fontSize: Dimens.option_text_size,
    },
});
//#endregion
