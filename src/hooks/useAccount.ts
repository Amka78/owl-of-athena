//#region Import Modules
import { useCallback, useEffect, useState } from "react";
import { User, GuestUser } from "../types";
import { AuroraRestClientInstance } from "../clients";
import { useDispatch } from "react-redux";

import { updateUser } from "../actions";
import { useCheckLogging, useUserSelector, useLogout } from "./";
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
    onSavePress: () => Promise<void>;
    onLogoutPress: () => void;
    generalError: string;
} => {
    useCheckLogging();
    const dispatch = useDispatch();

    const userInfo = useUserSelector();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [birthDay, setBirthDay] = useState(new Date());
    const useLogoutHook = useLogout();

    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");

    useEffect(() => {
        let unmounted = false;
        console.debug("useGetUser start");
        const f = async (): Promise<void> => {
            if (!unmounted)
                try {
                    console.debug("useGetUser useEffect start");
                    let currentUser;

                    if (userInfo?.id === GuestUser) {
                        currentUser = userInfo;
                    } else {
                        currentUser = await AuroraRestClientInstance.getAuthUser();
                    }
                    console.debug("authenticatedUser", currentUser);
                    dispatch(updateUser(currentUser));
                    setFirstName(currentUser.first_name!);
                    setLastName(currentUser.last_name!);
                    setGender(currentUser.gender ? currentUser.gender : "male");
                    setBirthDay(new Date(currentUser.birthday!));
                } catch (ex) {
                    console.debug(ex);
                }
        };
        f();
        const cleanup = (): void => {
            unmounted = true;
        };
        return cleanup;
    }, [dispatch, userInfo]);

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

    const onSavePress = useCallback(async () => {
        setLoading(true);
        try {
            if (
                userInfo!.id !== GuestUser &&
                validate(userInfo!, setGeneralError)
            ) {
                await AuroraRestClientInstance.updateUser(userInfo as User);
            }
        } catch (e) {
            if (e.message) {
                setGeneralError(e.message);
            }
        } finally {
            setLoading(false);
        }
    }, [userInfo]);

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
        onSavePress,
        onLogoutPress,
        generalError,
    };
};
//#endregion

//#region Function
function validate(
    user: Partial<User>,
    setGeneralError: React.Dispatch<React.SetStateAction<string>>
): boolean {
    console.debug(user);
    console.debug(setGeneralError);
    return true;
}
//#endregion
