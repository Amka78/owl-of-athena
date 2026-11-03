import { useAuthStore } from "../authStore";
import type { User } from "../../types";

const user: User = {
    id: "user-1",
    birthday: "2000-01-01",
    created_at: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    roles: [{ id: "admin", slug: "admin", title: "Admin" }],
};

describe("authStore", () => {
    beforeEach(() => {
        useAuthStore.setState({
            user: undefined,
            token: undefined,
            lastUsedEmail: undefined,
            inactiveRoles: [],
        });
    });

    it("persists inactive roles", () => {
        useAuthStore.getState().setInactiveRoles(["admin"]);

        expect(useAuthStore.getState().inactiveRoles).toEqual(["admin"]);
    });

    it("resets inactive roles on login and logout", () => {
        useAuthStore.getState().setInactiveRoles(["admin"]);
        useAuthStore.getState().login(user, "token");

        expect(useAuthStore.getState().inactiveRoles).toEqual([]);

        useAuthStore.getState().setInactiveRoles(["admin"]);
        useAuthStore.getState().logout();

        expect(useAuthStore.getState().inactiveRoles).toEqual([]);
    });
});