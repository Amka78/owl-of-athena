//#region Import Modules
import type { CheckBoxField, SliderField, ToggleField, TimeField, LedEffectField, BuzzSongField } from "../../sdk/AuroraTypes";
import { ListItemComponentProps } from "../atoms/ListItem";
//#endregion

export type OptionProps = {
    title: string;
    description?: string;
    left: (props: ListItemComponentProps) => React.ReactNode;
    disabled: boolean;
    field: ToggleField | SliderField | CheckBoxField | TimeField | LedEffectField | BuzzSongField;
    onValueChange: () => void;
};
