import {
    cache,
    updateFilter,
    select,
    update,
    deleteById,
    initialize,
} from "../ProfilesActions";
import { AuroraProfile } from "../../sdk/AuroraTypes";

const mockProfile: AuroraProfile = {
    id: "prof-1",
    type: "official",
    name: "test.prof",
    title: "Test Profile",
    content: "",
} as AuroraProfile;

describe("ProfilesActions", () => {
    it("cache creates correct action", () => {
        const result = cache([mockProfile]);
        expect(result.type).toBe("CACHE_PROFILES");
        expect(result.payload.list).toEqual([mockProfile]);
    });

    it("updateFilter creates correct action", () => {
        const result = updateFilter({ showOfficial: false });
        expect(result.type).toBe("UPDATE_PROFILE_FILTER");
        expect(result.payload.filter).toEqual({ showOfficial: false });
    });

    it("select creates correct action", () => {
        const result = select(mockProfile);
        expect(result.type).toBe("SELECT_PROFILE");
        expect(result.payload.profile).toEqual(mockProfile);
    });

    it("update creates correct action", () => {
        const result = update(mockProfile);
        expect(result.type).toBe("UPDATE_PROFILE");
        expect(result.payload.profile).toEqual(mockProfile);
    });

    it("deleteById creates correct action", () => {
        const result = deleteById("prof-1");
        expect(result.type).toBe("DELETE_PROFILE");
        expect(result.payload.profileId).toBe("prof-1");
    });

    it("initialize creates correct action", () => {
        const result = initialize();
        expect(result.type).toBe("INITIALIZE_PROFILES");
    });
});
