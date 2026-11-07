//#region Import Modules
import { useCallback, useEffect, useState } from "react";
import { AuroraRestClientInstance } from "../clients";
import { useAuthStore } from "../store/authStore";
import { GuestUser, type User } from "../types";
import { buildAccountUpdate, parseBirthday } from "../utils/account";

import { useCheckLogging, useLogout, useUserSelector } from "./";
//#endregion

//#region Hooks
export const useAcount = (): {
    loading: boolean;
    firstName: string;
    onFirstNameChangeText: (text: string) => void;
    lastName: string;
    onLastNameChangeText: (text: string) => void;
    birthDay: Date;
    onBirthDayChange: (date: Date) => void;
    gender: string;
    onGenderChange: (value: string) => void;
    countryCode: string;
    onCountryCodeChangeText: (text: string) => void;
    postalCode: string;
    onPostalCodeChangeText: (text: string) => void;
    onSavePress: () => Promise<void>;
    onLogoutPress: () => void;
    generalError: string;
} => {
    useCheckLogging();
    const { updateUser } = useAuthStore();

    const userInfo = useUserSelector();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [birthDay, setBirthDay] = useState(new Date());
    const useLogoutHook = useLogout();

    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");

    const userId = userInfo?.id;

    useEffect(() => {
        let unmounted = false;
        console.debug("useGetUser start");
        const f = async (): Promise<void> => {
            if (!unmounted)
                try {
                    console.debug("useGetUser useEffect start");
                    let currentUser;

                    if (userId === GuestUser) {
                        // Use cached user data for guest
                        currentUser = { id: GuestUser } as any;
                    } else if (userId) {
                        currentUser = await AuroraRestClientInstance.getAuthUser();
                    } else {
                        return;
                    }
                    console.debug("authenticatedUser", currentUser);
                    updateUser(currentUser);
                    setFirstName(currentUser.first_name!);
                    setLastName(currentUser.last_name!);
                    setGender(currentUser.gender ? currentUser.gender : "male");
                    setCountryCode(currentUser.country_code ?? "");
                    setPostalCode(currentUser.postal_code ?? "");
                    setBirthDay(parseBirthday(currentUser.birthday));
                } catch (ex) {
                    console.debug(ex);
                }
        };
        f();
        const cleanup = (): void => {
            unmounted = true;
        };
        return cleanup;
    }, [updateUser, userId]);

    const onFirstNameChangeText = useCallback((text: string): void => {
        setFirstName(text);
    }, []);

    const onLastNameChangeText = useCallback((text: string): void => {
        setLastName(text);
    }, []);

    const onBirthDayChange = useCallback((date: Date) => {
        setBirthDay(date);
    }, []);

    const onGenderChange = useCallback((gender: string) => {
        setGender(gender);
    }, []);

    const onCountryCodeChangeText = useCallback((text: string): void => {
        setCountryCode(text.toUpperCase().slice(0, 2));
    }, []);

    const onPostalCodeChangeText = useCallback((text: string): void => {
        setPostalCode(text);
    }, []);

    const onSavePress = useCallback(async () => {
        if (userInfo === undefined) return;

        setLoading(true);
        setGeneralError("");
        try {
            if (userInfo.id === GuestUser) return;

            // 画面で編集した値を保存する（userInfo は読み込み時のままで古い）
            const edited = buildAccountUpdate(userInfo, {
                firstName,
                lastName,
                gender,
                birthDay,
                countryCode,
                postalCode,
            });
            if (!validate(edited, setGeneralError)) return;

            const saved = await AuroraRestClientInstance.updateUser(edited);
            updateUser(saved);
        } catch (e) {
            if (e instanceof Error) {
                setGeneralError(e.message);
            }
        } finally {
            setLoading(false);
        }
    }, [userInfo, firstName, lastName, gender, birthDay, countryCode, postalCode, updateUser]);

    const onLogoutPress = useLogoutHook.onPress;
    return {
        loading,
        firstName,
        onFirstNameChangeText,
        lastName,
        onLastNameChangeText,
        birthDay,
        onBirthDayChange,
        gender,
        onGenderChange,
        countryCode,
        onCountryCodeChangeText,
        postalCode,
        onPostalCodeChangeText,
        onSavePress,
        onLogoutPress,
        generalError,
    };
};
//#endregion

//#region Function
function validate(
    user: Partial<User>,
    setGeneralError: React.Dispatch<React.SetStateAction<string>>,
): boolean {
    console.debug(user);
    console.debug(setGeneralError);
    return true;
}
//#endregion
