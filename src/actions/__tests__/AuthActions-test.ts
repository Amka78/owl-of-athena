import { login, logout, updateUser } from "../AuthActions";
import { User } from "../../types";

const mockUser: User = {
    id: "user-1",
    birthday: "2000-01-01",
    created_at: "2021-01-01",
    updatedAt: "2021-01-01",
} as any;

describe("AuthActions", () => {
    describe("login", () => {
        it("creates correct login action", () => {
            const result = login(mockUser, "my-token");
            expect(result.type).toBe("LOGIN");
            expect(result.payload.data).toEqual(mockUser);
            expect(result.payload.token).toBe("my-token");
        });
    });

    describe("logout", () => {
        it("creates correct logout action", () => {
            const result = logout();
            expect(result.type).toBe("LOGOUT");
        });
    });

    describe("updateUser", () => {
        it("creates correct updateUser action", () => {
            const result = updateUser(mockUser);
            expect(result.type).toBe("UPDATE_USER");
            expect(result.payload.data).toEqual(mockUser);
        });
    });
});
