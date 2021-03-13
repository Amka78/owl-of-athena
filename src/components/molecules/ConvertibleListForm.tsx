//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import { Colors } from "../../constants";
//#endregion

//#region Types
export type ConvertibleListFormProps = {
    listMenu?: React.ReactNodeArray;
    listScreen?: React.ReactNode;
    itemScreen?: React.ReactNode;
};
//#endregion

//#region Component
export const ConvertibleListForm: FunctionComponent<ConvertibleListFormProps> = (
    props: ConvertibleListFormProps
) => {
    const list = (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    backgroundColor: Colors.navy,
                    borderBottomColor: Colors.white,
                    borderBottomWidth: 1,
                    flexDirection: "row",
                    justifyContent: "space-around",
                }}
            >
                {props.listMenu}
            </View>
            {props.listScreen}
        </View>
    );
    return (
        <View style={{ flexDirection: "row", flex: 1 }}>
            <View style={{ flex: 3 }}>{list}</View>
            <View
                style={{
                    flex: 7,
                    borderLeftColor: Colors.white,
                    borderLeftWidth: 1,
                }}
            >
                {props.itemScreen}
            </View>
        </View>
    );
};
//#endregion
