import { Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const maxWidth = 1280;

export default {
    isSmallDevice: width < 375,
    isLargeDevice: width > 1280,
    window: {
        height,
        width,
        fixedWidth: width > 1280 ? maxWidth : width
    },
    maxWidth: 1280
};
