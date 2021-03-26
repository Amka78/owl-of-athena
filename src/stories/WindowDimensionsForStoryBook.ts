import { Dimensions as WindowDimensions } from "react-native";

import { Dimens } from "../constants";
import { Dimensions } from "../hooks/useWindowDimensions";

export const getDimensions = (): Dimensions => {
    const currentDimens = WindowDimensions.get("window");
    const isVertical = currentDimens.width < currentDimens.height;
    const dimens: Dimensions = {
        fontScale: currentDimens.fontScale,
        height: currentDimens.height,
        width: currentDimens.width,
        scale: currentDimens.scale,
        isDesktop:
            currentDimens.height >= Dimens.inner_screen_max_height &&
            currentDimens.width >= Dimens.inner_screen_max_width,
        isSmallHeight: currentDimens.height <= Dimens.small_height,
        isLargeWidth: currentDimens.width > Dimens.button_max_width * 2,
        isVertical,
        isHorizontal: !isVertical,
    };
    return dimens;
};
