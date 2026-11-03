//#region Import Modules
import React, { type FunctionComponent } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import { Card, Divider } from "react-native-paper";

import { Colors, Dimens, Message } from "../../../constants";
import { useLocale } from "../../../hooks";
import type { AuroraProfileOption, SongValue, StimLedValue } from "../../../sdk/AuroraTypes";
import {
    checkProfileOptionConditions,
    type GroupedProfileOptionList,
    type ProfileOptionValues,
} from "../../../services/ProfileService";
import { ProfileOption } from "./ProfileOption";
//#endregion

//#region Types
export type ProfileOptionListProps = {
    groupedOptionList: GroupedProfileOptionList;
    optionValues?: ProfileOptionValues;
    onHelpIconPress?: () => void;
    onValueChange?: (optionName: string, value: unknown) => void;
    onPreviewEffectPress?: (value: StimLedValue) => void;
    onPreviewSongPress?: (value: SongValue) => void;
    style: StyleProp<ViewStyle>;
    locale?: string;
};
//#endregion

//#region Component
export const ProfileOptionList: FunctionComponent<ProfileOptionListProps> = (
    props: ProfileOptionListProps,
) => {
    useLocale(props.locale);
    const optionValues = props.optionValues ?? {};

    return (
        <View style={props.style}>
            {props.groupedOptionList.map((value: [string, AuroraProfileOption[]]) => {
                const title = value[0];
                const options = value[1];
                if (options.length === 0) return null;

                return (
                    <Card key={title} style={cardStyle}>
                        <Card.Title
                            title={Message.get(options[0].groupName)}
                            titleStyle={cardTitleStyle}
                            style={cardContainerStyle}
                        ></Card.Title>

                        {options.map((value: AuroraProfileOption, index: number) => {
                            const divider =
                                index !== 0 ? <Divider style={dividerStyle}></Divider> : undefined;
                            return (
                                <View key={value.name}>
                                    {divider}
                                    <ProfileOption
                                        profileOption={value}
                                        value={optionValues[value.name]}
                                        onValueChange={(nextValue: unknown): void =>
                                            props.onValueChange?.(value.name, nextValue)
                                        }
                                        onHelpIconPress={props.onHelpIconPress}
                                        onPreviewEffectPress={props.onPreviewEffectPress}
                                        onPreviewSongPress={props.onPreviewSongPress}
                                        failed={!checkProfileOptionConditions(value, optionValues)}
                                    ></ProfileOption>
                                </View>
                            );
                        })}
                    </Card>
                );
            })}
        </View>
    );
};
//#endregion

//#region Styles
const dividerStyle: ViewStyle = {
    backgroundColor: Colors.third_accent_color,
};

const cardStyle: ViewStyle = {
    backgroundColor: Colors.cardBackgroundColor,
    marginTop: Dimens.profile_list_option_list_margin,
};

const cardContainerStyle = {
    backgroundColor: Colors.third_accent_color,
};

const cardTitleStyle = { color: Colors.second_color };
//#endregion
