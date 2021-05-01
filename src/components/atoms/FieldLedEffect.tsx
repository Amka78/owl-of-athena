//#region Import Modules
import React, { FunctionComponent } from "react";
import { Text, StyleProp, TextStyle, ViewStyle, View } from "react-native";
import { Button } from "../atoms";
import { Colors, Message, MessageKeys } from "../../constants";
import { Picker } from "@react-native-community/picker";
//#endregion

//#region Types
const Blink = "blink";
const Set = "set";
const Alternate = "alternate";
const Transition = "transition";

type LedEffect =
    | typeof Blink
    | typeof Set
    | typeof Alternate
    | typeof Transition;

export type FieldLedEffectProps = {
    value: LedEffect | string;
    disabled: boolean;
    onPreviewEffectPress: () => void;
    onValueChange: (value: LedEffect) => void;
    style?: StyleProp<ViewStyle>;
};
//#endregion

//#region Component
export const FieldLedEffect: FunctionComponent<FieldLedEffectProps> = (
    props: FieldLedEffectProps
) => {
    return (
        <View>
            <View style={pickerContainer}>
                <Text>
                    {Message.get(MessageKeys.choose, [MessageKeys.lef_effect])}
                </Text>
                <Picker
                    selectedValue={props.value}
                    style={pickerStyle}
                    itemStyle={pickerItemStyle}
                    onValueChange={(itemValue: React.ReactText) => {
                        props.onValueChange(itemValue as LedEffect);
                    }}
                >
                    <Picker.Item
                        value={""}
                        label={Message.get(MessageKeys.no_effect)}
                    ></Picker.Item>
                    <Picker.Item
                        value={Set}
                        label={Message.get(MessageKeys.set)}
                    ></Picker.Item>
                    <Picker.Item
                        value={Blink}
                        label={Message.get(MessageKeys.blink)}
                    ></Picker.Item>
                    <Picker.Item
                        value={Alternate}
                        label={Message.get(MessageKeys.alternate)}
                    ></Picker.Item>
                    <Picker.Item
                        value={Transition}
                        label={Message.get(MessageKeys.transition)}
                    ></Picker.Item>
                </Picker>
                <Button screenWidth={50} onPress={props.onPreviewEffectPress}>
                    {Message.get(MessageKeys.preview, [MessageKeys.effect])}
                </Button>
            </View>
        </View>
    );
};
//#endregion

//#region Styles
const pickerContainer: ViewStyle = {
    flexDirection: "row",
};
const pickerStyle: ViewStyle = {
    backgroundColor: Colors.purple,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomColor: Colors.cyan,
};

const pickerItemStyle: TextStyle = {
    textDecorationColor: Colors.white,
    borderColor: Colors.white,
};
//#endregion
