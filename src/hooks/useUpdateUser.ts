import { useCallback, useState } from "react";
import { User } from "../types";
import { AuroraRestClientInstance } from "../clients";
export const useUpdateUser = (
    loadingInitialValue: boolean,
    user: Partial<User>
): {
    loading: boolean;
    onPress: () => Promise<void>;
    generalError: string;
} => {
    const [loading, setLoading] = useState(loadingInitialValue);
    const [generalError, setGeneralError] = useState("");
    const onPress = useCallback(async () => {
        setLoading(true);
        try {
            if (validate(user, setGeneralError)) {
                await AuroraRestClientInstance.updateUser(user as User);
            }
        } catch (e) {
            if (e.message) {
                setGeneralError(e.message);
            }
            setLoading(false);
        }
    }, [user]);
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
