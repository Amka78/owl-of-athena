//#region Import Modules
import React, { FunctionComponent } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { CheckBoxField } from "../../sdk/AuroraTypes";
import { StreamIds } from "../../sdk/AuroraConstants";
import { LabeledCheckBox } from "../molecules";
import { Colors } from "../../constants";
//#endregion

//#region Types
export type FieldStreamCheckBoxesProps = {
    value?: number;
    field: CheckBoxField;
    disabled: boolean;
    onValueChange: () => void;
    style?: StyleProp<ViewStyle>;
};
//#endregion

//#region Component
export const FieldStreamCheckBoxes: FunctionComponent<FieldStreamCheckBoxesProps> = (
    props: FieldStreamCheckBoxesProps
) => {
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
                return (
                    <LabeledCheckBox
                        key={value.label}
                        label={value.label}
                        labelStyle={{ color: Colors.white }}
                        labelPlace={"right"}
                        status={"checked"}
                    ></LabeledCheckBox>
                );
            })}
        </View>
    );
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
