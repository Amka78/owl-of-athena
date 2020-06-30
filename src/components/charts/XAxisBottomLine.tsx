//#region Import Modules
import React, { FC } from "react";
import { Line } from "react-native-svg";
//#endregion

export type XAxisBottomLineProps = {
    width: number;
    height: number;
    color: string;
};

export const XAxisBottomLine: FC<XAxisBottomLineProps> = (
    props: XAxisBottomLineProps
) => {
    return (
        <Line
            stroke={props.color}
            x1={0}
            x2={props.width}
            y1={props.height}
            y2={props.height}
        ></Line>
    );
};
