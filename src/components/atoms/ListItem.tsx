//#region Import Modules
import React, { FunctionComponent } from "react";
import { TextStyle, ViewStyle } from "react-native";
import { List } from "react-native-paper";
import { Colors } from "../../constants";
//#endregion

//#region Types
export type ListItemComponentProps = {
    color: string;
    style: {
        marginLeft?: number;
        marginRight: number;
        marginVertical?: number;
    };
};

export type ListItemProps = {
    left?: (props: ListItemComponentProps) => React.ReactNode;
    right?: (props: ListItemComponentProps) => React.ReactNode;
    style?: ViewStyle;
    title: string;
    titleStyle?: ViewStyle;
    description?: string;
    descriptionStyle?: TextStyle;
    disabled?: boolean;
    onPress?: () => void;
};
//#endregion

//#region Component
export const ListItem: FunctionComponent<ListItemProps> = (
    props: ListItemProps
) => {
    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        <List.Item
            {...props}
            titleStyle={[menuLabel, props.titleStyle]}
            descriptionStyle={[menuDescription, props.descriptionStyle]}
        ></List.Item>
    );
};
//#endregion

//#region Styles
const menuLabel: TextStyle = { color: Colors.white };
const menuDescription: TextStyle = { color: Colors.gray };
//#endregion
