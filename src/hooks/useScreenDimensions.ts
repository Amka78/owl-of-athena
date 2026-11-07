import { useCallback, useState } from "react";
import type { LayoutChangeEvent } from "react-native";

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

    const onLayout = useCallback((event: LayoutChangeEvent): void => {
        const { width, height } = event.nativeEvent.layout;
        setScreenDimens((current) =>
            current.width === width && current.height === height ? current : { width, height },
        );
    }, []);

    return {
        width: screenDimens.width,
        height: screenDimens.height,
        onLayout,
    };
};
