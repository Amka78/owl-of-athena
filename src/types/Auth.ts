import { User } from "./User";

export type Auth = {
    user: User;
    token: string;
};

export const GuestUser = "GuestUser";
