//#region Import Modules
import React, { type FunctionComponent } from "react";
import { View } from "react-native";

import type { SongValue } from "../../sdk/AuroraTypes";
import { FieldBuzzSong } from "../atoms/FieldBuzzSong";
import { ListItem } from "../atoms/ListItem";
import type { OptionProps } from "./OptionProps";
//#endregion

//#region Types
export type OptionBuzzSongProps = OptionProps & {
    value?: SongValue | string;
};
//#endregion

//#region Component
export const OptionBuzzSong: FunctionComponent<OptionBuzzSongProps> = (
    props: OptionBuzzSongProps,
) => {
    return (
        <View>
            <ListItem
                title={props.title}
                description={props.description}
                left={props.left}
                disabled={props.disabled}
            ></ListItem>
            <FieldBuzzSong
                value={props.value}
                disabled={props.disabled}
                onPreviewSongPress={(value): void => props.onPreviewSongPress?.(value)}
                onValueChange={(value): void => props.onValueChange(value)}
            ></FieldBuzzSong>
        </View>
    );
};
//#endregion
