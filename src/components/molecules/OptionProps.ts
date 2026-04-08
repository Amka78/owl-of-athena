//#region Import Modules
import type {
    BuzzSongField,
    CheckBoxField,
    LedEffectField,
    SliderField,
    TimeField,
    ToggleField,
} from "../../sdk/AuroraTypes";
import type { ListItemComponentProps } from "../atoms/ListItem";
//#endregion

export type OptionProps = {
    title: string;
    description?: string;
    left: (props: ListItemComponentProps) => React.ReactNode;
    disabled: boolean;
    field: ToggleField | SliderField | CheckBoxField | TimeField | LedEffectField | BuzzSongField;
    onValueChange: () => void;
};
