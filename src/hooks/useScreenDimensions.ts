import { useState } from "react";
import { LayoutChangeEvent } from "react-native";
export type ScreenDimensions = {
    width: number;
    height: number;
};
export const useScreenDimensions = (): {
    width: number;
    height: number;
    onLayout: (event: LayoutChangeEvent) => void;
} => {
    const [screenDimens, setScreenDimens] = useState<ScreenDimensions>({
        width: 0,
        height: 0,
    });

    const onLayout = (event: LayoutChangeEvent): void => {
        setScreenDimens({
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height,
        });
    };

    return {
        width: screenDimens.width,
        height: screenDimens.height,
        onLayout,
    };
};
