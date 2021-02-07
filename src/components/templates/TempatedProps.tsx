import { PickerItemProps } from "react-native";
import {
    ButtonProps,
    TextBoxProps,
    LabeledRadioButtonProps,
    LabeledTimeViewProps,
    LabeledSelectorMenuProps,
} from "..";
import { FlatButtonProps } from "../FlatButton";
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
export {
    TemplateButtonProps,
    TemplateTextBoxProps,
    TemplateRadioButtonProps,
    TemplateFlatButtonProps,
    TemplatePickerItemProps,
    TemplateSelectorMenuProps,
    TemplateTimeViewProps,
};
