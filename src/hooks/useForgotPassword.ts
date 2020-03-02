import { useCallback, useState } from "react";

import { Message } from "../constants";

export const useForgotPassword = (
    loadingInitialValue: boolean,
    emailAddress: string
): { loading: boolean; onPress: () => Promise<void>; generalError: string } => {
    const [loading, setLoading] = useState(loadingInitialValue);
    // const { auroraClient } = useClientSelector();
    const [generalError, setGeneralError] = useState("");
    const onPress = useCallback(async () => {
        setLoading(true);
        try {
            console.debug("called forgotPasswordOnPress:", emailAddress);
            throw new Error();
        } catch (e) {
            setGeneralError(Message.get("wip_dialog_message"));
        }

        setLoading(false);
    }, [emailAddress]);
    return { loading, onPress, generalError };
};
