//#region Import Modules
import type { User } from "../../types";
import { buildAccountUpdate, formatBirthday, parseBirthday } from "../account";

//#endregion

//#region Test Data
const user: User = {
    id: "user-1",
    first_name: "Old",
    last_name: "Name",
    gender: "male",
    birthday: "2000-01-01",
    created_at: "2020-01-01T00:00:00.000Z",
    updatedAt: "2020-01-01T00:00:00.000Z",
};
//#endregion

//#region Tests
describe("account utils", () => {
    it("builds the update payload from the edited values", () => {
        const updated = buildAccountUpdate(user, {
            firstName: "New",
            lastName: "Family",
            gender: "female",
            birthDay: new Date(2001, 1, 3),
        });

        expect(updated.first_name).toBe("New");
        expect(updated.last_name).toBe("Family");
        expect(updated.gender).toBe("female");
        expect(updated.birthday).toBe("2001-02-03");
        expect(updated.id).toBe("user-1");
    });

    it("formats the birthday as the local calendar date", () => {
        expect(formatBirthday(new Date(2001, 1, 3))).toBe("2001-02-03");
        expect(formatBirthday(new Date(2001, 11, 31))).toBe("2001-12-31");
    });

    it("parses the stored birthday without shifting the day", () => {
        const parsed = parseBirthday("2000-01-01");

        expect(parsed.getFullYear()).toBe(2000);
        expect(parsed.getMonth()).toBe(0);
        expect(parsed.getDate()).toBe(1);
    });

    it("falls back to a valid date for unexpected values", () => {
        expect(parseBirthday(undefined) instanceof Date).toBe(true);
        expect(Number.isNaN(parseBirthday("not-a-date").getTime())).toBe(false);
    });
});
//#endregion
