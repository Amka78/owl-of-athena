//#region Import Modules
import React, { type FunctionComponent } from "react";
import { View, type ViewStyle } from "react-native";
import { ListItem } from "../ui";
import type { ListItemComponentProps } from "../ui/ListItem";
import { FieldStreamCheckBoxes } from "./FieldStreamCheckboxes";
import type { OptionProps } from "./OptionProps";
//#endregion

//#region Types
export type OptionCheckBoxesProps = OptionProps & {
    value?: number | number[] | string;
};
//#endregion

//#region Component
export const OptionCheckBoxes: FunctionComponent<OptionCheckBoxesProps> = (
    props: OptionCheckBoxesProps,
) => {
    const { isLargeWidth = true, ...listProps } = props;

    if (!isLargeWidth) {
        // 狭幅（モバイル）ではチップを right スロットに押し込まず、
        // OptionLedEffect / OptionBuzzSong と同じ「タイトル下に全幅」に並べる。
        return (
            <View>
                <ListItem {...listProps}></ListItem>
                <FieldStreamCheckBoxes
                    {...(listProps as any)}
                    style={stackedFieldStyle}
                ></FieldStreamCheckBoxes>
            </View>
        );
    }

    return (
        <ListItem
            {...listProps}
            right={(_rightProps: ListItemComponentProps) => {
                return (
                    <FieldStreamCheckBoxes
                        {...(listProps as any)}
                        style={{ flex: 1, maxWidth: 500 }}
                    ></FieldStreamCheckBoxes>
                );
            }}
        ></ListItem>
    );
};
//#endregion

//#region Styles
// FieldLedEffect / FieldBuzzSong のタイトル下コンテナと揃える。
const stackedFieldStyle: ViewStyle = {
    width: "100%",
    paddingHorizontal: 8,
    paddingBottom: 8,
};
//#endregion
