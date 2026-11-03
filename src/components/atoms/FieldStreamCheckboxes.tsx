//#region Import Modules
import React, { type FunctionComponent } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import { Colors } from "../../constants";
import { StreamIds } from "../../sdk/AuroraConstants";
import type { CheckBoxField } from "../../sdk/AuroraTypes";
import { LabeledCheckBox } from "../molecules/LabeledCheckBox";
//#endregion

//#region Types
export type FieldStreamCheckBoxesProps = {
    value?: number | number[] | string;
    field: CheckBoxField;
    disabled: boolean;
    onValueChange: (value: number[]) => void;
    style?: StyleProp<ViewStyle>;
};
//#endregion

//#region Component
export const FieldStreamCheckBoxes: FunctionComponent<FieldStreamCheckBoxesProps> = (
    props: FieldStreamCheckBoxesProps,
) => {
    const selected = toStreamIds(props.value);

    return (
        <View
            style={{
                flex: 1,
                maxWidth: 500,
                flexDirection: "row",
                flexWrap: "wrap",
            }}
        >
            {streamOptions.map((value: { label: string; value: number }) => {
                const checked = selected.includes(value.value);

                return (
                    <LabeledCheckBox
                        key={value.label}
                        label={value.label}
                        labelStyle={{ color: Colors.white }}
                        labelPlace={"right"}
                        status={checked ? "checked" : "unchecked"}
                        onPress={
                            props.disabled
                                ? undefined
                                : (): void => {
                                      props.onValueChange(
                                          checked
                                              ? selected.filter((id) => id !== value.value)
                                              : [...selected, value.value],
                                      );
                                  }
                        }
                    ></LabeledCheckBox>
                );
            })}
        </View>
    );
};

const toStreamIds = (value: FieldStreamCheckBoxesProps["value"]): number[] => {
    if (Array.isArray(value)) {
        return value.map(Number).filter((id) => !Number.isNaN(id));
    }

    let mask: number | undefined;

    if (typeof value === "number") {
        mask = value;
    } else if (typeof value === "string" && value.length > 0) {
        mask = value.toLowerCase().startsWith("0x") ? parseInt(value, 16) : parseInt(value, 10);
    }

    if (mask === undefined || Number.isNaN(mask)) return [];

    return streamOptions.map((option) => option.value).filter((id) => (mask! & (1 << id)) !== 0);
};

const streamOptions: { label: string; value: number }[] = [
    { label: "EEG", value: StreamIds.RAW_EEG },
    { label: "Signal On/Off", value: StreamIds.SIGNAL_QUALITY },
    { label: "Sleep Stages", value: StreamIds.SLEEP_STAGES },
    { label: "Sleep Tracker", value: StreamIds.SLEEP_TRACKER },
    { label: "EEG Delta", value: StreamIds.EEG_DELTA },
    { label: "EEG Theta", value: StreamIds.EEG_THETA },
    { label: "EEG Alpha", value: StreamIds.EEG_ALPHA },
    { label: "EEG Beta", value: StreamIds.EEG_BETA },
    { label: "EEG Gamma", value: StreamIds.EEG_GAMMA },
    { label: "EEG Power Sum", value: StreamIds.EEG_POWER_SUM },
    { label: "Accelerometer X-axis", value: StreamIds.ACCEL_X },
    { label: "Accelerometer Y-axis", value: StreamIds.ACCEL_Y },
    { label: "Accelerometer Z-axis", value: StreamIds.ACCEL_Z },
    {
        label: "Accelerometer Magnitude",
        value: StreamIds.ACCEL_MAGNITUDE,
    },
    { label: "Gyroscope X-axis", value: StreamIds.GYRO_X },
    { label: "Gyroscope Y-axis", value: StreamIds.GYRO_Y },
    { label: "Gyroscope Z-axis", value: StreamIds.GYRO_Z },
    { label: "Gyroscope Magnitude", value: StreamIds.GYRO_MAGNITUDE },
    { label: "3D-Rotation Roll", value: StreamIds.ROTATION_ROLL },
    { label: "3D-Rotation Pitch", value: StreamIds.ROTATION_PITCH },
    { label: "Accelerometer Std. Dev.", value: StreamIds.ACCEL_STDDEV },
    { label: "Heart Rate", value: StreamIds.HEART_RATE },
    { label: "Temperature", value: StreamIds.TEMPERATURE },
    { label: "Battery", value: StreamIds.BATTERY },
];
//#endregion
