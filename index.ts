import { AppRegistry, Platform } from "react-native";
import App from "./App";
// @ts-ignore
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);

if (Platform.OS === "web") {
    AppRegistry.runApplication(appName, {
        rootTag: document.getElementById("root"),
    });
}
