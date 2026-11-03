//#region Import Modules
import React, { type FunctionComponent } from "react";
import { type StyleProp, Text, View, type ViewStyle } from "react-native";

import { Colors, Message, MessageKeys } from "../../constants";
import type { TimeField } from "../../sdk/AuroraTypes";
import { FlatButton } from "./FlatButton";
import { InlineTimePicker } from "./InlineTimePicker";
//#endregion

//#region Types
export type FieldTimeProps = {
    value?: boolean | string | number;
    field: TimeField;
    disabled: boolean;
    onValueChange: (value: number | undefined) => void;
    style?: StyleProp<ViewStyle>;
};
//#endregion

//#region Component
export const FieldTime: FunctionComponent<FieldTimeProps> = (props: FieldTimeProps) => {
    const milliseconds = toMilliseconds(props.value);

    if (milliseconds === undefined) {
        return (
            <View style={[containerStyle, props.style]}>
                <Text style={unsetLabelStyle}>{props.field.labelCleared}</Text>
                {!props.disabled && (
                    <FlatButton onPress={(): void => props.onValueChange(props.field.defaultTime)}>
                        {formatMilliseconds(props.field.defaultTime)}
                    </FlatButton>
                )}
            </View>
        );
    }

    return (
        <View style={[containerStyle, props.style]}>
            <InlineTimePicker
                mode24hours={true}
                mode={"minute"}
                initialTime={toTime(milliseconds)}
                containerStyle={{
                    backgroundColor: Colors.cardBackgroundColor,
                    margin: 0,
                }}
                style={{
                    backgroundColor: Colors.third_accent_color,
                }}
                onChangeTime={(hours, minutes): void => {
                    if (props.disabled) return;
                    const step = props.field.minutesStep > 0 ? props.field.minutesStep : 1;
                    const totalMinutes = (hours ?? 0) * 60 + (minutes ?? 0);
                    const snapped = Math.round(totalMinutes / step) * step;
                    props.onValueChange(
                        ((snapped % (24 * 60)) * 60 * 1000) % (24 * 60 * 60 * 1000),
                    );
                }}
            ></InlineTimePicker>
            {props.field.clearable && !props.disabled && (
                <FlatButton onPress={(): void => props.onValueChange(undefined)}>
                    {Message.get(MessageKeys.clear)}
                </FlatButton>
            )}
        </View>
    );
};

const toMilliseconds = (value: FieldTimeProps["value"]): number | undefined => {
    if (value === undefined || value === null || value === false) return undefined;
    if (typeof value === "boolean") return value ? 0 : undefined;

    if (typeof value === "string") {
        const match = value.match(/^(\d{1,2}):(\d{2})$/);
        if (match) {
            return (
                ((parseInt(match[1], 10) * 60 + parseInt(match[2], 10)) * 60 * 1000) %
                (24 * 60 * 60 * 1000)
            );
        }
    }

    const parsed = typeof value === "number" ? value : parseInt(value as string, 10);
    if (Number.isNaN(parsed) || parsed < 0) return undefined;

    return parsed % (24 * 60 * 60 * 1000);
};

const toTime = (milliseconds: number): { hours: number; minutes: number; seconds: number } => {
    return {
        hours: Math.floor(milliseconds / (60 * 60 * 1000)) % 24,
        minutes: Math.floor(milliseconds / (60 * 1000)) % 60,
        seconds: Math.floor(milliseconds / 1000) % 60,
    };
};

const formatMilliseconds = (milliseconds: number): string => {
    const time = toTime(milliseconds);
    return `${String(time.hours).padStart(2, "0")}:${String(time.minutes).padStart(2, "0")}`;
};
//#endregion

//#region Styles
const containerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
};

const unsetLabelStyle = {
    color: Colors.gray,
    marginRight: 8,
};
//#endregion
