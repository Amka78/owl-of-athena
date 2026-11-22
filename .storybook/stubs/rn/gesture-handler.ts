// Vite alias target for react-native-gesture-handler.
// The app only uses its TouchableOpacity / ScrollView, but the package eagerly
// loads the v3 Gesture API whose native-bridge setup (RNGestureHandlerModule /
// worklets) cannot run in the browser. Re-export the react-native-web
// equivalents instead and drop the native-boundary machinery entirely.
import {
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    ScrollView,
    FlatList,
    SectionList,
    Switch,
    TextInput,
} from "react-native-web";

export {
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    ScrollView,
    FlatList,
    SectionList,
    Switch,
    TextInput,
};

export const GestureHandlerRootView = ({ children }: any) => children;
export const GestureDetector = ({ children }: any) => children;

export const State = {
    UNDETERMINED: 0,
    FAILED: 1,
    BEGAN: 2,
    CANCELLED: 3,
    ACTIVE: 4,
    END: 5,
};

export default { TouchableOpacity, ScrollView, GestureHandlerRootView, State };