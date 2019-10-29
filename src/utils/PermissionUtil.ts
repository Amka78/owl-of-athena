import * as Permissions from "expo-permissions";
import { Linking } from "react-native";

export default class PermissionUtil {
    public static async getPermission(permission: any) {
        const { status } = await Permissions.askAsync(permission);
        if (status !== "granted") {
            Linking.openURL("app-settings:");
            return false;
        }
        return true;
    }
}
