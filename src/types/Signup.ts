export type Signup = {
    email: string;

    password: string;

    passwordConfirm: string;

    agreeToTerm: boolean;

    firstName: string;
    lastName: string;
    birthday?: Date;
    gender: string;
    newsletter: boolean;
};
