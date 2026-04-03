import ActionTypes from "../ActionTypes";

describe("ActionTypes", () => {
    it("exports LOGIN constant", () => {
        expect(ActionTypes.LOGIN).toBe("LOGIN");
    });

    it("exports LOGOUT constant", () => {
        expect(ActionTypes.LOGOUT).toBe("LOGOUT");
    });

    it("exports UPDATE_USER constant", () => {
        expect(ActionTypes.UPDATE_USER).toBe("UPDATE_USER");
    });

    it("exports CACHE_SETTINGS constant", () => {
        expect(ActionTypes.CACHE_SETTINGS).toBe("CACHE_SETTINGS");
    });

    it("exports CACHE_PROFILES constant", () => {
        expect(ActionTypes.CACHE_PROFILES).toBe("CACHE_PROFILES");
    });

    it("exports SELECT_PROFILE constant", () => {
        expect(ActionTypes.SELECT_PROFILE).toBe("SELECT_PROFILE");
    });

    it("exports UPDATE_PROFILE constant", () => {
        expect(ActionTypes.UPDATE_PROFILE).toBe("UPDATE_PROFILE");
    });

    it("exports DELETE_PROFILE constant", () => {
        expect(ActionTypes.DELETE_PROFILE).toBe("DELETE_PROFILE");
    });

    it("exports CACHE_SESSIONS constant", () => {
        expect(ActionTypes.CACHE_SESSIONS).toBe("CACHE_SESSIONS");
    });

    it("exports CACHE_SESSION_DETAILS constant", () => {
        expect(ActionTypes.CACHE_SESSION_DETAILS).toBe("CACHE_SESSION_DETAILS");
    });

    it("exports SELECT_SESSION constant", () => {
        expect(ActionTypes.SELECT_SESSION).toBe("SELECT_SESSION");
    });

    it("exports DELETE_SESSION constant", () => {
        expect(ActionTypes.DELETE_SESSION).toBe("DELETE_SESSION");
    });

    it("exports WAKELOCK constant", () => {
        expect(ActionTypes.WAKELOCK).toBe("WAKE_LOCK");
    });

    it("exports INITIALIZE_AURORA constant", () => {
        expect(ActionTypes.INITIALIZE_AURORA).toBe("INITIALIZE_AURORA");
    });

    it("exports INITIALIZE_SESSION constant", () => {
        expect(ActionTypes.INITIALIZE_SESSION).toBe("INITIALIZE_SESSION");
    });

    it("exports INITIALIZE_PROFILES constant", () => {
        expect(ActionTypes.INITIALIZE_PROFILES).toBe("INITIALIZE_PROFILES");
    });
});
