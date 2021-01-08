import { Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const maxWidth = 1280;
const isWidthSmallDevice = width <= 414;

export default {
    isWidthSmallDevice,
    isSmallDevice: isWidthSmallDevice || height < 667,
    isLargeDevice: width > 1280,
    window: {
        height,
        width,
        fixedWidth: width > 1280 ? maxWidth : width,
    },
    maxWidth: 1280,
};
