import AuthReducers from "../AuthReducers";
import { AuthActions } from "../../actions/AuthActions";
import { AuthState } from "../../state";
import { User } from "../../types";

describe("AuthReducers", () => {
    const mockUser: User = {
        id: "user-1",
        birthday: "2000-01-01",
        created_at: "2021-01-01",
        updatedAt: "2021-01-01",
        providers: {
            email: {
                provider_key: "test@example.com",
                activation_expires_at: undefined,
            },
        },
    } as any;

    it("returns default state when undefined", () => {
        const action = { type: "__UNKNOWN__" } as any;
        const result = AuthReducers(undefined as any, action);
        expect(result).toEqual({});
    });

    it("handles LOGIN action", () => {
        const action: AuthActions = {
            payload: { data: mockUser, token: "token123" },
            type: "LOGIN",
        };
        const result = AuthReducers({}, action);
        expect(result.user).toEqual(mockUser);
        expect(result.token).toBe("token123");
        expect(result.lastUsedEmail).toBe("test@example.com");
    });

    it("handles LOGOUT action", () => {
        const state: AuthState = { user: mockUser, token: "abc" };
        const action: AuthActions = { type: "LOGOUT" };
        const result = AuthReducers(state, action);
        expect(result.user).toBeUndefined();
        expect(result.token).toBeUndefined();
    });

    it("handles UPDATE_USER action", () => {
        const state: AuthState = { user: mockUser, token: "abc" };
        const updatedUser = { ...mockUser, id: "user-updated" };
        const action: AuthActions = {
            payload: { data: updatedUser },
            type: "UPDATE_USER",
        };
        const result = AuthReducers(state, action);
        expect(result.user?.id).toBe("user-updated");
        expect(result.token).toBe("abc");
    });

    it("returns current state for unknown action", () => {
        const state: AuthState = { token: "xyz" };
        const action = { type: "UNKNOWN" } as any;
        const result = AuthReducers(state, action);
        expect(result).toEqual(state);
    });
});
