import { createOfficialProfile } from "../ProfileService";
describe("ProfileService-test", () => {
    it("Successful creation of an official profile.", async () => {
        const fetchMock = fetch as jest.Mock;
        fetchMock.mockReturnValueOnce({
            text: async () => {
                return "test";
            },
        });
        const officialProfile = await createOfficialProfile();

        expect(officialProfile.id).toBe("F367G2");
        expect(officialProfile.options).not.toBeUndefined();
        expect(officialProfile.content).not.toBeUndefined();
        expect(fetchMock.mock.calls.length).toBe(1);
        expect(fetchMock.mock.calls[0][0]).toBe("test");
    });
});
