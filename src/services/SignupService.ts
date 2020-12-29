//#region Import Modules
import { Signup } from "../types";
import { Message, MessageKeys } from "../constants";
//#endregion

//#region Function
export const validate = (
    signup: Signup,
    emailErrorCallback: (err: string) => void,
    passwordErrorCallback: (err: string) => void,
    passwordConfirmErrorCallback: (err: string) => void,
    generalErrorCallback: (err: string) => void
): boolean => {
    if (signup.email === "") {
        emailErrorCallback(
            Message.get(MessageKeys.required, [MessageKeys.signup_input_email])
        );

        return false;
    }
    if (signup.password === "") {
        passwordErrorCallback(
            Message.get(MessageKeys.required, [
                MessageKeys.signup_input_password,
            ])
        );
        return false;
    }
    if (signup.passwordConfirm === "") {
        passwordConfirmErrorCallback(
            Message.get(MessageKeys.required, [
                MessageKeys.signup_input_password_confirm,
            ])
        );
        return false;
    }
    if (signup.password !== signup.passwordConfirm) {
        passwordConfirmErrorCallback(
            Message.get(MessageKeys.passwords_must_match)
        );
        return false;
    }
    if (signup.agreeToTerm === false) {
        generalErrorCallback(
            Message.get(MessageKeys.must_agree_to_term_of_use)
        );
        return false;
    }

    return true;
};
//#endregion
