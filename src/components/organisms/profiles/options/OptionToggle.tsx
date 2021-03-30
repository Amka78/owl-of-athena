//#region Import Modules
import React, { FunctionComponent } from "react";
import { ListItem } from "../../../atoms";
import { ListItemComponentProps } from "../../../atoms/ListItem";
import { ToggleField } from "../../../../sdk/AuroraTypes";
import { FieldToggle } from "../fields/FieledToggle";
//#endregion

//#region Types
export type OptionToggleProps = {
    title: string;
    description?: string;
    left: (props: ListItemComponentProps) => React.ReactNode;
    disabled: boolean;
    field: ToggleField;
    value: boolean | string;
    onValueChange: () => void;
};
//#endregion

//#region Component
export const OptionToggle: FunctionComponent<OptionToggleProps> = (
    props: OptionToggleProps
) => {
    return (
        <ListItem
            {...props}
            right={(rightProps: ListItemComponentProps) => {
                return (
                    <FieldToggle
                        {...props}
                        style={[rightProps.style, { alignSelf: "center" }]}
                    ></FieldToggle>
                );
            }}
        ></ListItem>
    );
};
//#endregion
