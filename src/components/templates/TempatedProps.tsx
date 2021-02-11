//#region Import Modules
import { PickerItemProps } from "react-native";

import { ButtonProps, TextBoxProps } from "../atoms";
import { FlatButtonProps } from "../atoms/FlatButton";
import {
    LabeledRadioButtonProps,
    LabeledSelectorMenuProps,
    LabeledTimeViewProps,
} from "../molecules";

//#endregion

//#region Types
type TemplateButtonProps = Pick<ButtonProps, "onPress">;

type TemplateTextBoxProps = Pick<TextBoxProps, "value" | "onChangeText">;

type TemplateRadioButtonProps = Pick<LabeledRadioButtonProps, "value">;

type TemplateFlatButtonProps = Pick<FlatButtonProps, "onPress">;

type TemplatePickerItemProps = Pick<PickerItemProps, "value">;

type TemplateTimeViewProps = Pick<LabeledTimeViewProps, "hours" | "minutes">;

type TemplateSelectorMenuProps = Pick<
    LabeledSelectorMenuProps,
    "onPress" | "value"
>;
//#endregion

//#region Export
export {
    TemplateButtonProps,
    TemplateTextBoxProps,
    TemplateRadioButtonProps,
    TemplateFlatButtonProps,
    TemplatePickerItemProps,
    TemplateSelectorMenuProps,
    TemplateTimeViewProps,
};
//#endregion
