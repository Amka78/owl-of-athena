import { GuestUser } from "../../types/Auth";
import { createGuestUser } from "../WelcomeService";

describe("WelcomeService - createGuestUser", () => {
    it("returns an Auth object with GuestUser id", () => {
        const now = Date.now();
        const result = createGuestUser(now);
        expect(result.user.id).toBe(GuestUser);
    });

    it("returns empty token", () => {
        const result = createGuestUser(Date.now());
        expect(result.token).toBe("");
    });

    it("user has birthday, created_at, and updatedAt", () => {
        const now = 1700000000000;
        const result = createGuestUser(now);
        expect(result.user.birthday).toBeDefined();
        expect(result.user.created_at).toBeDefined();
        expect(result.user.updatedAt).toBeDefined();
    });
});
