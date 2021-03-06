//#region Import Modules
import React, { FunctionComponent } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Card, Divider } from "react-native-paper";

import { Colors, Dimens, Message } from "../../../constants";
import { useLocale } from "../../../hooks";
import { AuroraProfileOption as AuroraProfileOption } from "../../../sdk/AuroraTypes";
import { GroupedProfileOptionList } from "../../../services/ProfileService";
import { ProfileOption } from "./ProfileOption";
//#endregion

//#region Types
export type ProfileOptionListProps = {
    groupedOptionList: GroupedProfileOptionList;
    onHelpIconPress: () => void;
    onValueChange: () => void;
    style: StyleProp<ViewStyle>;
    locale?: string;
};
//#endregion

//#region Component
export const ProfileOptionList: FunctionComponent<ProfileOptionListProps> = (
    props: ProfileOptionListProps
) => {
    useLocale(props.locale);
    return (
        <View style={props.style}>
            {props.groupedOptionList.map(
                (value: [string, AuroraProfileOption[]]) => {
                    const title = value[0];
                    const options = value[1];
                    return (
                        <Card key={title} style={cardStyle}>
                            <Card.Title
                                title={Message.get(options[0].groupName)}
                                titleStyle={cardTitleStyle}
                                style={cardContainerStyle}
                            ></Card.Title>

                            {options.map(
                                (value: AuroraProfileOption, index: number) => {
                                    const divider =
                                        index !== 0 ? (
                                            <Divider
                                                style={dividerStyle}
                                            ></Divider>
                                        ) : undefined;
                                    return (
                                        <View key={value.name}>
                                            {divider}
                                            <ProfileOption
                                                profileOption={value}
                                                onValueChange={
                                                    props.onValueChange
                                                }
                                                onHelpIconPress={
                                                    props.onHelpIconPress
                                                }
                                                failed={false}
                                            ></ProfileOption>
                                        </View>
                                    );
                                }
                            )}
                        </Card>
                    );
                }
            )}
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
