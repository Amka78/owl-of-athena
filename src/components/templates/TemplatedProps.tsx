//#region Import Modules
import type { PickerItemProps } from "@react-native-picker/picker";
import type { LabeledCheckBoxProps } from "../molecules/LabeledCheckBox";
import type { LabeledRadioButtonProps } from "../molecules/LabeledRadioButton";
import type { LabeledSelectorMenuProps } from "../molecules/LabeledSelectorMenu";
import type { LabeledTimeViewProps } from "../molecules/LabeledTimeView";
import type { ButtonProps } from "../ui/Button";
import type { FlatButtonProps } from "../ui/FlatButton";
import type { TextBoxProps } from "../ui/TextBox";

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

type TemplateSelectorMenuProps = Pick<LabeledSelectorMenuProps, "onPress" | "value">;

//#endregion

//#region Export
export type {
    TemplateButtonProps,
    TemplateFlatButtonProps,
    TemplateLabeledCheckBoxProps,
    TemplatePickerItemProps,
    TemplateRadioButtonProps,
    TemplateSelectorMenuProps,
    TemplateTextBoxProps,
    TemplateTimeViewProps,
    TemplateValidateTextBoxProps,
};
//#endregion
