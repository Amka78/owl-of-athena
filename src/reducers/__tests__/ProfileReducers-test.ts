import ProfileReducers, { initialState } from "../ProfileReducers";
import { ProfilesActions } from "../../actions/ProfilesActions";
import { AuroraProfile } from "../../sdk/AuroraTypes";

const makeProfile = (id: string, type: AuroraProfile["type"]): AuroraProfile =>
    ({
        id,
        type,
        name: `${id}.prof`,
        title: id,
        content: "",
    } as AuroraProfile);

describe("ProfileReducers", () => {
    it("returns initial state when undefined", () => {
        const action = { type: "__UNKNOWN__" } as any;
        const result = ProfileReducers(undefined as any, action);
        expect(result.list).toHaveLength(0);
        expect(result.filteredList).toHaveLength(0);
    });

    it("caches profiles and filters them", () => {
        const profiles = [
            makeProfile("p1", "official"),
            makeProfile("p2", "community"),
            makeProfile("p3", "private"),
        ];
        const action: ProfilesActions = {
            payload: { list: profiles },
            type: "CACHE_PROFILES",
        };
        const result = ProfileReducers(initialState, action);
        expect(result.list).toHaveLength(3);
        expect(result.filteredList).toHaveLength(3);
    });

    it("filters profiles by official only", () => {
        const profiles = [
            makeProfile("p1", "official"),
            makeProfile("p2", "community"),
        ];
        const state = { ...initialState, list: profiles };
        const filterAction: ProfilesActions = {
            payload: { filter: { showCommunity: false, showPrivate: false } },
            type: "UPDATE_PROFILE_FILTER",
        };
        const result = ProfileReducers(state, filterAction);
        expect(result.filteredList).toHaveLength(1);
        expect(result.filteredList[0].type).toBe("official");
    });

    it("selects a profile", () => {
        const profile = makeProfile("p1", "official");
        const action: ProfilesActions = {
            payload: { profile },
            type: "SELECT_PROFILE",
        };
        const result = ProfileReducers(initialState, action);
        expect(result.selected).toEqual(profile);
    });

    it("deletes a profile by id", () => {
        const profiles = [makeProfile("p1", "official"), makeProfile("p2", "community")];
        const state = { ...initialState, list: profiles, filteredList: profiles };
        const action: ProfilesActions = {
            payload: { profileId: "p1" },
            type: "DELETE_PROFILE",
        };
        const result = ProfileReducers(state, action);
        expect(result.list.find((p) => p.id === "p1")).toBeUndefined();
    });

    it("initializes profiles to initial state", () => {
        const profile = makeProfile("p1", "official");
        const state = { ...initialState, list: [profile], selected: profile };
        const action: ProfilesActions = { type: "INITIALIZE_PROFILES" };
        const result = ProfileReducers(state, action);
        expect(result.list).toHaveLength(0);
        expect(result.selected).toBeUndefined();
    });

    it("updates a profile", () => {
        const profile = makeProfile("p1", "official");
        const state = { ...initialState, list: [profile] };
        const updatedProfile = { ...profile, title: "Updated Title" };
        const action: ProfilesActions = {
            payload: { profile: updatedProfile },
            type: "UPDATE_PROFILE",
        };
        const result = ProfileReducers(state, action);
        expect(result.list[0].title).toBe("Updated Title");
    });
});
