import "jest-enzyme";
import "react-native";

import { ObjectID } from "bson";
import { ShallowWrapper } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import { Alert } from "react-native";

import { AuthClient } from "../../clients";
import { Message } from "../../constants";
import { AuthDto, TokenDto, UserDto } from "../../model";
import { TokenManager } from "../../utils";
import { FakeGestureResponderEvent, TestHelper } from "../../utils/TestHelper";
import LoginScreen, { IAuthProps, IState } from "../LoginScreen";

let component: ShallowWrapper<IAuthProps, IState, any>;
const mockAuthClient: AuthClient = new AuthClient("test", "test");
describe("LoginScreen-test", () => {
    beforeAll(async () => {
        Message.setLocale("ja-JP");
    });

    describe("when login", () => {
        beforeAll(async () => {
            const props = {
                authClient: mockAuthClient,
                isSignup: false,
                loginSuccess: undefined,
                navigation: undefined,
                token: "test"
            };
            // TODO
            // @ts-ignore
            component = TestHelper.createMock(<LoginScreen {...props} />);
        });

        beforeEach(async () => {
            component.setState({
                email: "",
                isEmailValid: false,
                isPasswordValid: false,
                password: "",
                passwordConfirm: "",
                showLoading: false
            });
            component = component.update();
        });
        it("The login form is displayed correctly", async () => {
            expect(component.length).toBe(1);

            const state = component.state();
            expect(state.email).toBe("");
            expect(state.isEmailValid).toBeFalsy();
            expect(state.isPasswordValid).toBeFalsy();
            expect(state.password).toBe("");
            expect(state.passwordConfirm).toBe("");
            expect(state.showLoading).toBeFalsy();

            // Two text boxes are displayed.
            expect(component.find("MultiLingualTextBox").length).toBe(2);
            // Login Button are displayed.
            expect(component.find("MultiLingualButton").length).toBe(1);

            expect(
                TestHelper.getButtonPropsByTestID(component, "loginButton")!
                    .localizedTitle
            ).toBe("login");

            expect(TestHelper.toJson(component)).toMatchSnapshot();
        });

        it.each(["", "test", "t@mail", ".com"])(
            "An error occurs if the mail is incorrect.",
            async (email: string) => {
                component.setState({ email });

                TestHelper.getTextBoxPropsByTestID(
                    component,
                    "accountIdTextBox"
                )!.onValidation!();

                component = component.update();

                expect(component.state().isEmailValid).toBeFalsy();
            }
        );

        it.each(["test@mail.com"])(
            "If there is no error in the mail address, no message is displayed.",
            async (email: string) => {
                component.setState({ email });

                TestHelper.getTextBoxPropsByTestID(
                    component,
                    "accountIdTextBox"
                )!.onValidation!();

                component = component.update();

                expect(component.state().isEmailValid).toBeTruthy();
            }
        );

        it.each(["", "t", "1234567"])(
            "Do not perform password check at login.",
            async (password: string) => {
                component.setState({ password });

                TestHelper.getTextBoxPropsByTestID(
                    component,
                    "passwordTextBox"
                )!.onValidation!();

                component = component.update();

                expect(component.state().isPasswordValid).toBeTruthy();
            }
        );

        it("Can log in when the correct value is entered.", async () => {
            expect(
                TestHelper.getButtonPropsByTestID(component, "loginButton")!
                    .disabled
            ).toBeTruthy();

            component.setState({
                isEmailValid: true
            });

            component = component.update();

            expect(
                TestHelper.getButtonPropsByTestID(component, "loginButton")!
                    .disabled
            ).toBeFalsy();
        });

        it("Can not log in unless the correct value is entered.", async () => {
            expect(
                TestHelper.getButtonPropsByTestID(component, "loginButton")!
                    .disabled
            ).toBeTruthy();

            component.setState({
                isEmailValid: false
            });

            component = component.update();

            expect(
                TestHelper.getButtonPropsByTestID(component, "loginButton")!
                    .disabled
            ).toBeTruthy();
        });

        it("submitLoginCredentials correct work", async () => {
            const testingEmail = "testuser@mail.com";
            const testingPassword = "test";
            component.setState({
                email: testingEmail,
                password: testingPassword
            });

            const navigate = jest.fn();
            const loginSuccess = jest.fn();

            component.setProps({
                loginSuccess,
                navigation: TestHelper.createNavigationMock({ navigate })
            });

            component.update();

            const testingUserId = new ObjectID("5c6daf4fe6e54f46319e4430");
            const testingToken = new TokenDto({
                token: "test",
                user: new UserDto({
                    id: testingUserId
                })
            });
            const loginMock = jest.fn(
                // @ts-ignore
                async (loginDto: AuthDto) => testingToken
            );

            const setMock = jest.fn();
            jest.spyOn(TokenManager, "set").mockImplementation(setMock);
            jest.spyOn(mockAuthClient, "login").mockImplementation(loginMock);

            await TestHelper.getButtonPropsByTestID(component, "loginButton")!
                .onPress!(FakeGestureResponderEvent);

            component = component.update();

            expect(component.state().showLoading).toBeFalsy();

            expect(loginMock.mock.calls.length).toBe(1);
            expect(loginMock.mock.calls[0][0].accountId).toBe(testingEmail);
            expect(loginMock.mock.calls[0][0].password).toBe(testingPassword);
            expect(loginSuccess.mock.calls.length).toBe(1);
            expect(loginSuccess.mock.calls[0][0].token).toBe(
                testingToken.token
            );
            expect(setMock.mock.calls.length).toBe(1);
            expect(setMock.mock.calls[0][0].token).toBe(testingToken.token);
            expect(setMock.mock.calls[0][0].user).toBe(
                testingUserId.toString()
            );
            expect(navigate.mock.calls.length).toBe(1);
            expect(navigate.mock.calls[0][0]).toBe("UserForm");
        });

        it("An error occurs if saving fails.", async () => {
            component.setState({
                email: "testuser@mail.com",
                password: "test"
            });

            const alertMock = jest.fn();

            jest.spyOn(mockAuthClient, "login").mockImplementation(() => {
                throw { error: "testError", message: "testMessage" };
            });
            jest.spyOn(Alert, "alert").mockImplementation(alertMock);

            await TestHelper.getButtonPropsByTestID(component, "loginButton")!
                .onPress!(FakeGestureResponderEvent);

            expect(alertMock.mock.calls.length).toBe(1);
            expect(alertMock.mock.calls[0][0]).toBe("testError");
            expect(alertMock.mock.calls[0][1]).toBe("testMessage");
        });
    });

    describe("when signup", () => {
        beforeAll(async () => {
            const props = {
                authClient: mockAuthClient,
                isSignup: true,
                loginSuccess: undefined,
                navigation: undefined,
                token: "test"
            };
            // TODO
            // @ts-ignore
            component = TestHelper.createMock(<LoginScreen {...props} />);
        });

        beforeEach(async () => {
            component.setState({
                email: "",
                isEmailValid: false,
                isPasswordValid: false,
                password: "",
                passwordConfirm: "",
                showLoading: false
            });
            component = component.update();
        });

        it("The signup form is displayed correctly", async () => {
            // Two text boxes are displayed.
            expect(component.find("MultiLingualTextBox").length).toBe(3);
            // Signup Button are displayed.
            expect(component.find("MultiLingualButton").length).toBe(1);

            expect(
                TestHelper.getButtonPropsByTestID(component, "loginButton")!
                    .localizedTitle
            ).toBe("create_account");

            expect(toJson(component)).toMatchSnapshot();
        });

        it.each(["", "t", "1234567"])(
            "An error occurs if the password is incorrect.",
            async (password: string) => {
                component.setState({ password });
                TestHelper.getTextBoxPropsByTestID(
                    component,
                    "passwordTextBox"
                )!.onValidation!();

                component = component.update();

                expect(component.state().isPasswordValid).toBeFalsy();
            }
        );

        it.each(["12345678", "123456789"])(
            "If there is no error in the password, no message is displayed.",
            async (password: string) => {
                component.setState({ password });
                TestHelper.getTextBoxPropsByTestID(
                    component,
                    "passwordTextBox"
                )!.onValidation!();

                component = component.update();

                expect(component.state().isPasswordValid).toBeTruthy();
            }
        );

        it.each(["12345678"])(
            "An error occurs if the password and password comfirm does not mouch.",
            async (password: string) => {
                component.setState({
                    password,
                    passwordConfirm: password + 1
                });

                TestHelper.getTextBoxPropsByTestID(
                    component,
                    "passwordConfirmTextBox"
                )!.onValidation!();

                component = component.update();

                expect(component.state().isPasswordConfirmValid).toBeFalsy();
            }
        );

        it.each(["12345678"])(
            "If there is no error in the passwordConfrim, no message is displayed.",
            async (password: string) => {
                component.setState({
                    password,
                    passwordConfirm: password
                });

                TestHelper.getTextBoxPropsByTestID(
                    component,
                    "passwordConfirmTextBox"
                )!.onValidation!();

                component = component.update();

                expect(component.state().isPasswordConfirmValid).toBeTruthy();
            }
        );

        it.each([
            [false, false, false],
            [true, false, false],
            [false, true, false],
            [true, true, false],
            [false, false, true],
            [true, false, true],
            [false, true, true]
        ])(
            "Can not sign up unless the correct value is entered.",
            async (
                isEmailValid: boolean,
                isPasswordValid: boolean,
                isPasswordConfirmValid: boolean
            ) => {
                expect(
                    TestHelper.getButtonPropsByTestID(component, "loginButton")!
                        .disabled
                ).toBeTruthy();

                component.setState({
                    isEmailValid,
                    isPasswordConfirmValid,
                    isPasswordValid
                });

                component = component.update();

                expect(
                    TestHelper.getButtonPropsByTestID(component, "loginButton")!
                        .disabled
                ).toBeTruthy();
            }
        );

        it("Can Signup when the correct value is entered.", async () => {
            const props = TestHelper.getButtonPropsByTestID(
                component,
                "loginButton"
            )!;
            expect(props.disabled).toBeTruthy();

            component.setState({
                isEmailValid: true,
                isPasswordConfirmValid: true,
                isPasswordValid: true
            });

            component = component.update();

            expect(
                TestHelper.getButtonPropsByTestID(component, "loginButton")!
                    .disabled
            ).toBeFalsy();
        });

        it("Succeed with signing up.", async () => {
            const testingEmail = "testuser@mail.com";
            const testingPassword = "test";
            component.setState({
                email: testingEmail,
                password: testingPassword,
                passwordConfirm: testingPassword
            });

            const navigate = jest.fn();
            const loginSuccess = jest.fn();

            component.setProps({
                loginSuccess,
                navigation: TestHelper.createNavigationMock({ navigate })
            });

            const testingUserId = new ObjectID("5c6daf4fe6e54f46319e4430");
            const testingToken = new TokenDto({
                token: "test",
                user: new UserDto({
                    id: testingUserId
                })
            });
            const signinMock = jest.fn(
                // @ts-ignore
                async (loginDto: AuthDto) => testingToken
            );

            const setMock = jest.fn();
            jest.spyOn(TokenManager, "set").mockImplementation(setMock);
            jest.spyOn(mockAuthClient, "signup").mockImplementation(signinMock);

            await TestHelper.getButtonPropsByTestID(component, "loginButton")!
                .onPress!(FakeGestureResponderEvent);

            component = component.update();

            expect(component.state().showLoading).toBeFalsy();

            expect(signinMock.mock.calls.length).toBe(1);
            expect(signinMock.mock.calls[0][0].accountId).toBe(testingEmail);
            expect(signinMock.mock.calls[0][0].password).toBe(testingPassword);
            expect(loginSuccess.mock.calls.length).toBe(1);
            expect(loginSuccess.mock.calls[0][0].token).toBe(
                testingToken.token
            );
            expect(setMock.mock.calls.length).toBe(1);
            expect(setMock.mock.calls[0][0].token).toBe(testingToken.token);
            expect(setMock.mock.calls[0][0].user).toBe(
                testingUserId.toString()
            );
            expect(navigate.mock.calls.length).toBe(1);
            expect(navigate.mock.calls[0][0]).toBe("UserForm");
        });
    });
});
