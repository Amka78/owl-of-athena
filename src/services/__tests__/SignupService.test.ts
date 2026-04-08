import type { Signup } from "../../types";
import { validate } from "../SignupService";

describe("SignupService - validate", () => {
    const makeCallbacks = () => ({
        emailError: jest.fn(),
        passwordError: jest.fn(),
        passwordConfirmError: jest.fn(),
        generalError: jest.fn(),
    });

    const validSignup: Signup = {
        email: "test@example.com",
        password: "pass123",
        passwordConfirm: "pass123",
        agreeToTerm: true,
    };

    it("returns true for a valid signup", () => {
        const cbs = makeCallbacks();
        const result = validate(
            validSignup,
            cbs.emailError,
            cbs.passwordError,
            cbs.passwordConfirmError,
            cbs.generalError,
        );
        expect(result).toBe(true);
        expect(cbs.emailError).not.toHaveBeenCalled();
        expect(cbs.passwordError).not.toHaveBeenCalled();
        expect(cbs.passwordConfirmError).not.toHaveBeenCalled();
        expect(cbs.generalError).not.toHaveBeenCalled();
    });

    it("calls emailError when email is empty", () => {
        const cbs = makeCallbacks();
        const signup = { ...validSignup, email: "" };
        const result = validate(
            signup,
            cbs.emailError,
            cbs.passwordError,
            cbs.passwordConfirmError,
            cbs.generalError,
        );
        expect(result).toBe(false);
        expect(cbs.emailError).toHaveBeenCalledTimes(1);
    });

    it("calls passwordError when password is empty", () => {
        const cbs = makeCallbacks();
        const signup = { ...validSignup, password: "" };
        const result = validate(
            signup,
            cbs.emailError,
            cbs.passwordError,
            cbs.passwordConfirmError,
            cbs.generalError,
        );
        expect(result).toBe(false);
        expect(cbs.passwordError).toHaveBeenCalledTimes(1);
    });

    it("calls passwordConfirmError when passwordConfirm is empty", () => {
        const cbs = makeCallbacks();
        const signup = { ...validSignup, passwordConfirm: "" };
        const result = validate(
            signup,
            cbs.emailError,
            cbs.passwordError,
            cbs.passwordConfirmError,
            cbs.generalError,
        );
        expect(result).toBe(false);
        expect(cbs.passwordConfirmError).toHaveBeenCalledTimes(1);
    });

    it("calls passwordConfirmError when passwords do not match", () => {
        const cbs = makeCallbacks();
        const signup = { ...validSignup, passwordConfirm: "different" };
        const result = validate(
            signup,
            cbs.emailError,
            cbs.passwordError,
            cbs.passwordConfirmError,
            cbs.generalError,
        );
        expect(result).toBe(false);
        expect(cbs.passwordConfirmError).toHaveBeenCalledTimes(1);
    });

    it("calls generalError when agreeToTerm is false", () => {
        const cbs = makeCallbacks();
        const signup = { ...validSignup, agreeToTerm: false };
        const result = validate(
            signup,
            cbs.emailError,
            cbs.passwordError,
            cbs.passwordConfirmError,
            cbs.generalError,
        );
        expect(result).toBe(false);
        expect(cbs.generalError).toHaveBeenCalledTimes(1);
    });
});
