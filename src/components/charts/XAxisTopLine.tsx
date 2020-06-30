//#region Import Modules
import React, { FC } from "react";
import { Line } from "react-native-svg";
//#endregion

export type XAxisTopLineProps = {
    width: number;
    color: string;
};

export const XAxisTopLine: FC<XAxisTopLineProps> = (
    props: XAxisTopLineProps
) => {
    return (
        <Line stroke={props.color} x1={0} x2={props.width} y1={0} y2={0}></Line>
    );
};
