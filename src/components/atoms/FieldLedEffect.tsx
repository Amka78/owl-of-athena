//#region Import Modules

import { Picker } from "@react-native-picker/picker";
import React, { type FunctionComponent } from "react";
import {
  type StyleProp,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import { Colors, Message, MessageKeys } from "../../constants";
import { Button } from "../atoms";

//#endregion

//#region Types
const Blink = "blink";
const SetEffect = "set";
const Alternate = "alternate";
const Transition = "transition";

type LedEffect =
  | typeof Blink
  | typeof SetEffect
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
  props: FieldLedEffectProps,
) => {
  return (
    <View>
      <View style={pickerContainer}>
        <Text>{Message.get(MessageKeys.choose, [MessageKeys.lef_effect])}</Text>
        <Picker
          selectedValue={props.value}
          style={pickerStyle}
          itemStyle={pickerItemStyle}
          onValueChange={(itemValue: string | number) => {
            props.onValueChange(itemValue as LedEffect);
          }}
        >
          <Picker.Item
            value={""}
            label={Message.get(MessageKeys.no_effect)}
          ></Picker.Item>
          <Picker.Item
            value={SetEffect}
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
