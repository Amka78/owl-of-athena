import { ADMIN_PAGE_SIZE, buildAdminSearchFilter } from "../AdminQueryModel";

describe("AdminQueryModel", () => {
    it("uses 20 rows per page", () => {
        expect(ADMIN_PAGE_SIZE).toBe(20);
    });

    it("builds an or filter across the search fields", () => {
        expect(buildAdminSearchFilter("Jane", ["first_name", "last_name"])).toBe(
            "first_name.ilike.%Jane%,last_name.ilike.%Jane%",
        );
    });

    it("returns undefined when the search or fields are empty", () => {
        expect(buildAdminSearchFilter("   ", ["first_name"])).toBeUndefined();
        expect(buildAdminSearchFilter("Jane", [])).toBeUndefined();
        expect(buildAdminSearchFilter("Jane", [""])).toBeUndefined();
    });

    it("removes PostgREST separators from the search term", () => {
        expect(buildAdminSearchFilter("Jane,Doe (x)", ["name"])).toBe("name.ilike.%Jane Doe x%");
    });
});
