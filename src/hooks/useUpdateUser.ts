import { useCallback, useState } from "react";
import { User } from "../types";
import { useRestClientSelector } from "./useRestClientSelector";

export const useUpdateUser = (
    loadingInitialValue: boolean,
    user: Partial<User>
): {
    loading: boolean;
    onPress: () => Promise<void>;
    generalError: string;
} => {
    const [loading, setLoading] = useState(loadingInitialValue);
    const restClient = useRestClientSelector();
    const [generalError, setGeneralError] = useState("");
    const onPress = useCallback(async () => {
        setLoading(true);
        try {
            if (validate(user, setGeneralError)) {
                await restClient.updateUser(user as User);
            }
        } catch (e) {
            if (e.message) {
                setGeneralError(e.message);
            }
            setLoading(false);
        }
    }, [user, restClient]);
    return {
        loading,
        onPress,
        generalError
    };
};

function validate(
    user: Partial<User>,
    setGeneralError: React.Dispatch<React.SetStateAction<string>>
): boolean {
    console.debug(user);
    console.debug(setGeneralError);
    return true;
}
