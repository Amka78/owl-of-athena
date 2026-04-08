import type { Mock } from "bun:test";
import {
    createOfficialProfile,
    defaultOptions,
    groupingProfileOptionList,
} from "../ProfileService";

describe("ProfileService-test", () => {
    it("Successful creation of an official profile.", async () => {
        const fetchMock = fetch as unknown as Mock<any>;
        fetchMock.mockReturnValueOnce({
            text: async () => {
                return "test";
            },
        });
        const officialProfile = await createOfficialProfile();

        expect(officialProfile.id).toBe("F367G2");
        expect(officialProfile.options).toEqual(defaultOptions);
        expect(officialProfile.content).toBe("test");
        expect(fetchMock.mock.calls.length).toBe(1);
    });

    it("Successful grouping profile options", () => {
        const grouped = groupingProfileOptionList(defaultOptions);

        expect(grouped.length).toBe(3);
        expect(grouped[0][0]).toBe("REM Stim Options");
        expect(grouped[1][0]).toBe("Alarm Options");
        expect(grouped[2][0]).toBe("Misc Options");
    });
});
