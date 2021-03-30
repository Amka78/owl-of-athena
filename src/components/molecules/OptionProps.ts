//#region Import Modules
import { SliderField, ToggleField } from "../../../../sdk/AuroraTypes";
import { ListItemComponentProps } from "../../../atoms/ListItem";
//#endregion

export type OptionProps = {
    title: string;
    description?: string;
    left: (props: ListItemComponentProps) => React.ReactNode;
    disabled: boolean;
    field: ToggleField | SliderField;
    onValueChange: () => void;
};
