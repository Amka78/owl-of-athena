import { User } from "../types";

import { ActionTypes } from "../constants";

export type Actions = ReturnType<
    typeof login | typeof updateUser | typeof logout
>;

export const login = (user: User) => ({
    payload: {
        data: user
    },
    type: ActionTypes.LOGIN
});

export const logout = () => ({
    type: ActionTypes.LOGOUT
});

export const updateUser = (userDto: User) => ({
    payload: {
        data: userDto
    },
    type: ActionTypes.UPDATE_USER
});
