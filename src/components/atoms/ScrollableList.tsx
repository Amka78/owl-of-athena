//#region Import Modules
import React, { FunctionComponent } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { List } from "react-native-paper";
//#endregion

//#region Types
export type ScrollableListProps = {
    children: React.ReactNodeArray;
};
//#endregion

//#region Component
export const ScrollableList: FunctionComponent<ScrollableListProps> = (
    props: ScrollableListProps
) => {
    return (
        <ScrollView style={{ flex: 1 }}>
            <List.Section style={{ flex: 1 }}>{props.children}</List.Section>
        </ScrollView>
    );
};
//#endregion
