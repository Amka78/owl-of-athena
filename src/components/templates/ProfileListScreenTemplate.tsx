//#region Import Modules
import React, { FunctionComponent } from "react";
import { View, ViewStyle } from "react-native";

import { useLocale, useScreenDimensions } from "../../hooks";
import { AuroraProfile } from "../../sdk/AuroraTypes";
import {
    CommunityIcon,
    DeleteIcon,
    ListItem,
    OfficialIcon,
    PrivateIcon,
    ScrollableList,
    StandardView,
    StarIcon,
} from "../atoms";
import { ListItemComponentProps } from "../atoms/ListItem";
import {
    ProfileListMenu,
    ProfileListMenuProps,
} from "../organisms/profiles/ProfileListMenu";
//#endregion

//#region Types

export type ProfileListScreenTemplateProps = {
    userId: string;
    showFilter: boolean;
    filterMenuProps: ProfileListMenuProps;
    list?: AuroraProfile[];
    onStarPress: (value: AuroraProfile) => Promise<void>;
    onDeletePress: (value: AuroraProfile) => void;
    onMenuPress: (value: AuroraProfile, index: number) => void;
    locale?: string;
};
//#endregion

//#region Component
export const ProfileListScreenTemplate: FunctionComponent<ProfileListScreenTemplateProps> = (
    props: ProfileListScreenTemplateProps
) => {
    useLocale(props.locale);

    const screenDimens = useScreenDimensions();
    let menu = undefined;
    if (props.showFilter) {
        menu = (
            <ProfileListMenu
                {...props.filterMenuProps}
                containerStyle={{ width: screenDimens.width }}
            ></ProfileListMenu>
        );
    }
    return props.list ? (
        <StandardView
            standardViewStyle={standardView}
            onLayout={screenDimens.onLayout}
        >
            {menu}
            <ScrollableList>
                {props.list.map((value: AuroraProfile, index: number) => {
                    let leftAvatar: React.ReactNode = undefined;
                    switch (value.type) {
                        case "community":
                            leftAvatar = <CommunityIcon></CommunityIcon>;
                            break;
                        case "private":
                            leftAvatar = <PrivateIcon></PrivateIcon>;
                            break;
                        case "official":
                            leftAvatar = <OfficialIcon></OfficialIcon>;
                            break;
                    }

                    const isUserProfile = value.id === props.userId;

                    return (
                        <ListItem
                            key={value.id}
                            left={(): React.ReactNode => leftAvatar}
                            right={(
                                rightProps: ListItemComponentProps
                            ): React.ReactNode => (
                                <View {...rightProps} style={iconContainer}>
                                    <StarIcon
                                        disabled={!isUserProfile}
                                        starred={value.starred}
                                        onPress={async () => {
                                            await props.onStarPress(value);
                                        }}
                                    ></StarIcon>

                                    <DeleteIcon
                                        disabled={!isUserProfile}
                                        onPress={() => {
                                            props.onDeletePress(value);
                                        }}
                                    ></DeleteIcon>
                                </View>
                            )}
                            title={value.title}
                            description={value.name}
                            style={{ width: screenDimens.width }}
                            onPress={() => {
                                props.onMenuPress(value, index);
                            }}
                        ></ListItem>
                    );
                })}
            </ScrollableList>
        </StandardView>
    ) : null;
};
//#endregion

//#region Styles
const iconContainer: ViewStyle = {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
};
const standardView: ViewStyle = { justifyContent: "flex-start" };
//#endregion
