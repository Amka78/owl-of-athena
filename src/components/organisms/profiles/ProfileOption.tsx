//#region "Import Modules"
import type React from "react";
import type { FunctionComponent } from "react";
import type { AuroraProfileOption, SongValue, StimLedValue } from "../../../sdk/AuroraTypes";
import { InfoIcon } from "../../atoms";
import { OptionBuzzSong } from "../../molecules/OptionBuzzSong";
import { OptionCheckBoxes } from "../../molecules/OptionCheckBoxes";
import { OptionLedEffect } from "../../molecules/OptionLedEffect";
import { OptionSlider } from "../../molecules/OptionSlider";
import { OptionTime } from "../../molecules/OptionTime";
import { OptionToggle } from "../../molecules/OptionToggle";
//#endregion

//#region Import Modules
export type ProfileOptionProps = {
    profileOption: AuroraProfileOption;
    value?: unknown;
    failed: boolean;
    onHelpIconPress?: () => void;
    onValueChange: (value: unknown) => void;
    onPreviewEffectPress?: (value: StimLedValue) => void;
    onPreviewSongPress?: (value: SongValue) => void;
};
//#endregion

export const ProfileOption: FunctionComponent<ProfileOptionProps> = (props: ProfileOptionProps) => {
    const infoIcon = <InfoIcon onPress={props.onHelpIconPress}></InfoIcon>;
    const OptionComponent = optionComponents[props.profileOption.field.type];

    if (!OptionComponent) return null;

    return (
        <OptionComponent
            disabled={props.failed}
            title={props.profileOption.title}
            description={props.failed ? props.profileOption.failedConditionMessage : undefined}
            left={(): React.ReactNode => infoIcon}
            field={props.profileOption.field}
            value={props.value ?? props.profileOption.value}
            onValueChange={props.onValueChange}
            onPreviewEffectPress={props.onPreviewEffectPress}
            onPreviewSongPress={props.onPreviewSongPress}
        ></OptionComponent>
    );
};

const optionComponents: Record<string, FunctionComponent<any>> = {
    toggle: OptionToggle,
    slider: OptionSlider,
    checkboxes: OptionCheckBoxes,
    time: OptionTime,
    "led-effect": OptionLedEffect,
    "buzz-song": OptionBuzzSong,
};
