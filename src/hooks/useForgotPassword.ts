//#region Import Modules
import { useCallback, useState } from "react";
import { useTextBox, useTextBoxReturn } from "./";
import { Message, MessageKeys } from "../constants";
import { useNavigation } from "@react-navigation/native";
//#endregion

//#region Hooks
export const useForgotPassword = (
    loadingInitialValue: boolean
): {
    loading: boolean;
    onForgotPasswordPress: () => Promise<void>;
    onCancelPress: () => void;
    emailAddress: useTextBoxReturn;
    generalError: string;
} => {
    const emailAddress = useTextBox("");
    const { navigate } = useNavigation();
    const [loading, setLoading] = useState(loadingInitialValue);
    // const { auroraClient } = useClientSelector();
    const [generalError, setGeneralError] = useState("");
    const onForgotPasswordPress = useCallback(async () => {
        setLoading(true);
        try {
            console.debug("called forgotPasswordOnPress:", emailAddress.value);
            throw new Error();
        } catch (e) {
            setGeneralError(Message.get(MessageKeys.wip_dialog_message));
        }

        setLoading(false);
    }, [emailAddress.value]);

    const onCancelPress = useCallback(() => {
        navigate("Login");
    }, [navigate]);

    return {
        loading,
        onForgotPasswordPress,
        onCancelPress,
        emailAddress,
        generalError,
    };
};
//#endregion
