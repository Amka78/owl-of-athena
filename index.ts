import { AppRegistry } from "react-native";
import App from "./App";

declare let document: any;
AppRegistry.registerComponent("Aurora-Web", () => App);
AppRegistry.runApplication("Aurora-Web", {
    rootTag: document.querySelector("main"),
});
