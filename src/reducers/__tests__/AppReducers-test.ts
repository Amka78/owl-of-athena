import AppReducers from "../AppReducers";
import { AppActions } from "../../actions/AppActions";
import { AppState } from "../../state";

describe("AppReducers", () => {
    const initialState: AppState = { wakeLock: false };

    it("returns default state when undefined", () => {
        const action = { type: "__UNKNOWN__" } as any;
        const result = AppReducers(undefined as any, action);
        expect(result.wakeLock).toBe(false);
    });

    it("sets wakeLock to true", () => {
        const action: AppActions = {
            payload: { data: true },
            type: "WAKE_LOCK",
        };
        const result = AppReducers(initialState, action);
        expect(result.wakeLock).toBe(true);
    });

    it("sets wakeLock to false", () => {
        const state: AppState = { wakeLock: true };
        const action: AppActions = {
            payload: { data: false },
            type: "WAKE_LOCK",
        };
        const result = AppReducers(state, action);
        expect(result.wakeLock).toBe(false);
    });

    it("returns current state for unknown action", () => {
        const action = { type: "UNKNOWN_ACTION" } as any;
        const result = AppReducers(initialState, action);
        expect(result).toEqual(initialState);
    });
});
