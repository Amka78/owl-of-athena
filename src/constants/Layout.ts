import { Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default {
    isSmallDevice: width < 375,
    isLargeDevice: width > 1280,
    window: {
        height,
        width
    },
    maxWidth: 1280
};
