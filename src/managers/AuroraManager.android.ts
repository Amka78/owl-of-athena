import { NativeModules } from "react-native";

const { AuroraModule } = NativeModules;
console.debug(`AuroraModule:${AuroraModule}`);
export default AuroraModule;
