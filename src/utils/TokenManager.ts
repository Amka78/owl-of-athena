import { Platform } from "@unimodules/core";
import * as SecureStore from "expo-secure-store";
import { AsyncStorage } from "react-native";

enum SecureStoreKeys {
    JWT_TOKEN = "jwt_token"
}
/**
 * Token Management Class
 *
 * @export
 * @class TokenManager
 */
export default class TokenManager {
    public static async hasToken(): Promise<boolean> {
        const result = await this.getPerPlatform(SecureStoreKeys.JWT_TOKEN);

        return result !== undefined;
    }

    /**
     * get token
     *
     * @static
     * @returns {(Promise<string | undefined>)}
     * @memberof TokenManager
     */
    public static async get(): Promise<string | undefined> {
        const token = await this.getPerPlatform(SecureStoreKeys.JWT_TOKEN);

        if (token) {
            return token;
        }

        return undefined;
    }

    /**
     * set token
     *
     * @static
     * @param {TokenDto} value
     * @memberof TokenManager
     */
    public static async set(value: string) {
        await this.setPerPlatform(SecureStoreKeys.JWT_TOKEN, value);
    }

    public static async reset() {
        await this.deletePerPlatform(SecureStoreKeys.JWT_TOKEN);
    }

    private static async getPerPlatform(key: string): Promise<string | null> {
        if (Platform.OS === "web") {
            return await AsyncStorage.getItem(key);
        }

        return await SecureStore.getItemAsync(key);
    }

    private static async setPerPlatform(
        key: string,
        value: string
    ): Promise<void> {
        if (Platform.OS === "web") {
            return await AsyncStorage.setItem(key, value);
        }

        return await SecureStore.setItemAsync(key, value);
    }

    private static async deletePerPlatform(key: string): Promise<void> {
        if (Platform.OS === "web") {
            return await AsyncStorage.removeItem(key);
        }

        return await SecureStore.deleteItemAsync(key);
    }
}
