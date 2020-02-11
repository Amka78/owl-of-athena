import { AppRegistry } from "react-native";
import App from "./App";

AppRegistry.registerComponent("Aurora-Web", () => App);
AppRegistry.runApplication("Aurora-Web", {
    // @ts-ignore
    rootTag: document.querySelector("main")
});
