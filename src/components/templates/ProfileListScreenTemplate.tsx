//#region Import Modules
import type React from "react";
import type { FunctionComponent } from "react";
import { View, type ViewStyle } from "react-native";

import { useLocale, useScreenDimensions } from "../../hooks";
import type { Dimensions } from "../../hooks/useWindowDimensions";
import type { AuroraProfile } from "../../sdk/AuroraTypes";
import { ProfileListMenu, type ProfileListMenuProps } from "../features/profiles/ProfileListMenu";
import {
    CommunityIcon,
    DeleteIcon,
    ListItem,
    OfficialIcon,
    PrivateIcon,
    ScrollableList,
    StandardView,
    StarIcon,
} from "../ui";
import type { ListItemComponentProps } from "../ui/ListItem";
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
    dimens: Dimensions;
    locale?: string;
};
//#endregion

//#region Component
export const ProfileListScreenTemplate: FunctionComponent<ProfileListScreenTemplateProps> = (
    props: ProfileListScreenTemplateProps,
) => {
    useLocale(props.locale);

    const screenDimens = useScreenDimensions();
    let menu: React.ReactNode;
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
            rootViewStyle={rootViewStyle}
            standardViewStyle={standardView}
            onLayout={screenDimens.onLayout}
        >
            {menu}
            <ScrollableList>
                {props.list.map((value: AuroraProfile, index: number) => {
                    let leftAvatar: React.ReactNode;
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
                            right={(rightProps: ListItemComponentProps): React.ReactNode => (
                                <View {...rightProps} style={iconContainer}>
                                    <StarIcon
                                        disabled={!isUserProfile}
                                        starred={value.starred ?? false}
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
                            style={styles.listItem}
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
// StandardView は既定で alignItems: "center" + 左右 48px（Dimens.content_margin_horizontal）の
// 中央寄せレイアウト。一覧はモバイルで画面幅いっぱいに描画したいため、
// root とコンテンツ列を stretch に、既定の左右余白を 0 に上書きする
// （セッション一覧と同様。余白を残すと行が細く中央寄せになり左右が大きく空く）。
const rootViewStyle: ViewStyle = { alignItems: "stretch" };
const standardView: ViewStyle = {
    alignItems: "stretch",
    justifyContent: "flex-start",
    marginLeft: 0,
    marginRight: 0,
};
const styles = {
    listItem: { width: "100%" } as ViewStyle,
};
//#endregion
