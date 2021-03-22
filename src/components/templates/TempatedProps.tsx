//#region Import Modules
import { PickerItemProps } from "react-native";
import { ButtonProps } from "../atoms/Button";
import { TextBoxProps } from "../atoms/TextBox";
import { FlatButtonProps } from "../atoms/FlatButton";
import { LabeledTimeViewProps } from "../molecules/LabeledTimeView";
import { LabeledRadioButtonProps } from "../molecules/LabeledRadioButton";
import { LabeledSelectorMenuProps } from "../molecules/LabeledSelectorMenu";
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
