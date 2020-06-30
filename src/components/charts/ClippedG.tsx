//#region Import Modules
import React, { FC } from "react";
import { G, ClipPath, Rect } from "react-native-svg";

export type ClippedGProps = {
    children: React.ReactNode;
    xChartRange: number[];
    yChartRange: number[];
};

export const ClippedG: FC<ClippedGProps> = (props: ClippedGProps) => {
    const clipPathId = "clip-path-" + Math.floor(Math.random() * 1000 + 1);
    return (
        <G clipPath={`url(#${clipPathId})`}>
            <ClipPath id={clipPathId}>
                <Rect
                    x={props.xChartRange[0]}
                    y={props.yChartRange[1]}
                    width={props.xChartRange[1] - props.xChartRange[0]}
                    height={props.yChartRange[0] - props.yChartRange[1]}
                ></Rect>
            </ClipPath>
            {props.children}
        </G>
    );
};
