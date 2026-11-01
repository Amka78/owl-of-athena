import { AppRegistry, Platform } from "react-native";
import App from "./App";
// @ts-ignore
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);

if (Platform.OS === "web") {
    AppRegistry.runApplication(appName, {
        // react-native-web は root の DOM 要素を渡すが、RN の型はブランド付きの RootTag を要求する
        rootTag: document.getElementById("root") as unknown as Parameters<
            typeof AppRegistry.runApplication
        >[1]["rootTag"],
        initialProps: {},
    });
}
