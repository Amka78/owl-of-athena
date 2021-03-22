/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { User } from "../types";

import { ActionTypes } from "../constants";

export type AuthActions = ReturnType<
    typeof login | typeof updateUser | typeof logout
>;

export const login = (user: User, token: string) => ({
    payload: {
        data: user,
        token: token,
    },
    type: ActionTypes.LOGIN,
});

export const logout = () => ({
    type: ActionTypes.LOGOUT,
});

export const updateUser = (userDto: User) => ({
    payload: {
        data: userDto,
    },
    type: ActionTypes.UPDATE_USER,
});
