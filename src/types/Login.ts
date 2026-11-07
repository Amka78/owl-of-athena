export type Login = {
    email: string;

    password: string;
};

export type CreateUser = Login & {
    firstName?: string;
    lastName?: string;
    /** YYYY-MM-DD */
    birthday?: string;
    gender?: string;
    newsletter?: boolean;
};
