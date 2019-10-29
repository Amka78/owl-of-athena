import { AppRegistry } from "react-native";
import App from "./App";

AppRegistry.registerComponent("Aracan-Web", () => App);
AppRegistry.runApplication("Aracan-Web", {
    // @ts-ignore
    rootTag: document.querySelector("main")
});
