//#region "Import Modules"
import React, { FunctionComponent } from "react";
import { AuroraProfileOption } from "../../../sdk/AuroraTypes";
import { InfoIcon } from "../../atoms";
import { OptionCheckBoxes, OptionSlider, OptionToggle } from "../../molecules";
//#endregion

//#region Import Modules
export type ProfileOptionProps = {
    profileOption: AuroraProfileOption;
    failed: boolean;
    onHelpIconPress: () => void;
    onValueChange: () => void;
};
//#endregion

export const ProfileOption: FunctionComponent<ProfileOptionProps> = (
    props: ProfileOptionProps
) => {
    const infoIcon = <InfoIcon onPress={props.onHelpIconPress}></InfoIcon>;
    const OptionComponent = optionComponents[props.profileOption.field.type];
    return (
        <OptionComponent
            disabled={props.failed}
            title={props.profileOption.title}
            description={
                props.failed
                    ? props.profileOption.failedConditionMessage
                    : undefined
            }
            left={() => infoIcon}
            field={props.profileOption.field}
        ></OptionComponent>
    );
};

const optionComponents: any = {
    toggle: OptionToggle,
    slider: OptionSlider,
    checkboxes: OptionCheckBoxes,
    time: OptionToggle,
    "led-effect": OptionToggle,
    "buzz-song": OptionToggle,
};
