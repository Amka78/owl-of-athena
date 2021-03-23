//#region Import Modules
import { PickerItemProps } from "react-native";
import { ButtonProps } from "../atoms/Button";
import { TextBoxProps } from "../atoms/TextBox";
import { FlatButtonProps } from "../atoms/FlatButton";
import { LabeledTimeViewProps } from "../molecules/LabeledTimeView";
import { LabeledRadioButtonProps } from "../molecules/LabeledRadioButton";
import { LabeledSelectorMenuProps } from "../molecules/LabeledSelectorMenu";
import { LabeledCheckBoxProps } from "../molecules/LabeledCheckBox";
//#endregion

//#region Types
type TemplateButtonProps = Pick<ButtonProps, "onPress">;

type TemplateTextBoxProps = Pick<TextBoxProps, "value" | "onChangeText">;

type TemplateValidateTextBoxProps = TemplateTextBoxProps & {
    errorText?: string;
};

type TemplateRadioButtonProps = Pick<LabeledRadioButtonProps, "value">;

type TemplateLabeledCheckBoxProps = Pick<
    LabeledCheckBoxProps,
    "onPress" | "status" | "onLabelPress"
>;

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
    TemplateLabeledCheckBoxProps,
    TemplateValidateTextBoxProps,
    TemplateRadioButtonProps,
    TemplateFlatButtonProps,
    TemplatePickerItemProps,
    TemplateSelectorMenuProps,
    TemplateTimeViewProps,
};
//#endregion
