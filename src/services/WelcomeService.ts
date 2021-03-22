//#region Import
import { Auth, GuestUser } from "../types/Auth";

/**
 * Create guest user information when in stand-alone mode.
 *
 * @param Pseudo-date for guest users
 * @export
 */
export const createGuestUser = (now: number): Auth => {
    const currentDate = now.toLocaleString();
    return {
        user: {
            id: GuestUser,
            birthday: currentDate,
            created_at: currentDate,
            updatedAt: currentDate,
        },
        token: "",
    };
};
