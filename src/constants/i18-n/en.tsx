import { MessageKeys } from "../MessageKeys";
const login = "Log In";
const signup = "Sign Up";
const input_email = "EMAIL ADDRESS";
const input_password = "PASSWORD";
const input_password_confirm = "REENTER PASSWORD";
const sessions = "sessions";
const input_first_name = "FIRST NAME";
const input_last_name = "LAST NAME";
const input_birthday = "BIRTHDAY";
const update = "Update";

export default {
    [MessageKeys.app_name]: "Aurora",
    [MessageKeys.save]: "SAVE",
    [MessageKeys.cancel]: "CANCEL",
    [MessageKeys.signup]: signup,
    [MessageKeys.login]: login,
    male: "Male",
    [MessageKeys.female]: "Female",
    [MessageKeys.update]: update,
    [MessageKeys.sessions]: sessions,
    [MessageKeys.long_dash]: "\u2014",
    [MessageKeys.pipe_separator]: " | ",
    // sleep stages
    [MessageKeys.stage_awake]: "Awake",
    [MessageKeys.stage_rem]: "REM",
    [MessageKeys.stage_light]: "Light Sleep",
    [MessageKeys.stage_deep]: "Deep Sleep",
    // form strings - uppercase since you can't style the hint/label separately
    [MessageKeys.input_first_name]: input_first_name,
    [MessageKeys.input_last_name]: input_last_name,
    [MessageKeys.input_email]: input_email,
    [MessageKeys.input_password]: input_password,
    [MessageKeys.input_password_confirm]: input_password_confirm,
    [MessageKeys.input_birthday]: input_birthday,
    // aurora strings
    [MessageKeys.aurora_connected]: "Aurora connected.",
    [MessageKeys.aurora_disconnected]: "Aurora disconnected.",
    [MessageKeys.aurora_unsynced_sessions_dialog_title]:
        "Unsynced Sessions Found",
    [MessageKeys.aurora_unsynced_sessions_dialog_message]:
        "Aurora has {0} unsynced session(s). Would you like to sync now?",
    [MessageKeys.aurora_low_battery_dialog_title]: "Aurora Battery is Low",
    [MessageKeys.aurora_low_battery_dialog_message]:
        "Aurora's battery is at {0}%. To ensure the Aurora remains connected through the night, consider charging the battery before continuing.",
    [MessageKeys.aurora_sync_successful_snackbar_message]:
        "Successfully synced {0} session(s).",
    [MessageKeys.aurora_sync_successful_snackbar_action]: "View Now",
    // welcome fragment
    [MessageKeys.welcome_title]: "Welcome to Aurora!",
    [MessageKeys.welcome_text]:
        "Aurora’s advanced software will help you improve dream recall, achieve sounder sleep,and accelerate your journey towards maximizing your potential. Sweet dreams!",
    [MessageKeys.welcome_login_button]: login,
    [MessageKeys.welcome_signup_button]: signup,
    // login fragment
    [MessageKeys.login_title]: login,
    [MessageKeys.login_input_email]: input_email,
    [MessageKeys.login_input_password]: input_password,
    [MessageKeys.login_forgot_password_button]: "Forgot password?",
    [MessageKeys.login_no_account_button]: "No account yet?",
    [MessageKeys.login_button]: login,
    [MessageKeys.login_loading_message]: "Logging in...",
    [MessageKeys.login_general_error_message]:
        "Login failed. Invalid email or password.",

    // forgot-password fragment
    [MessageKeys.forgot_password_title]: "Forgot Password?",
    [MessageKeys.forgot_password_text]:
        "Having trouble remembering your password? Input your email address below and we’ll send you instructions to reset it.",
    [MessageKeys.forgot_password_input_email]: input_email,
    [MessageKeys.forgot_password_button]: "Request Reset",

    // signup fragment
    [MessageKeys.signup_title]: signup,
    [MessageKeys.signup_input_email]: input_email,
    [MessageKeys.signup_input_password]: input_password,
    [MessageKeys.signup_input_password_confirm]: input_password_confirm,
    [MessageKeys.signup_terms]: "I agree to the terms of use",
    [MessageKeys.signup_newsletter]:
        "Keep me updated with Aurora news and developments",
    [MessageKeys.signup_button]: signup,

    // home fragment
    [MessageKeys.home_default_profile]: "Default Profile",
    [MessageKeys.home_title]: "Home",
    [MessageKeys.home_edit_alarm_button]: "Edit Alarm",
    [MessageKeys.home_go_to_sleep_button]: "Go To Sleep",
    [MessageKeys.home_aurora_disconnected_dialog_title]: "Aurora Not Connected",
    [MessageKeys.home_aurora_disconnected_dialog_message]:
        "To connect, please shut down the Aurora if it is on, then turn it back on.",
    [MessageKeys.home_go_to_sleep_loading_message]: "Configuring Aurora...",
    [MessageKeys.home_go_to_sleep_error_message]:
        "Failed configuring Aurora. Please reset the unit and try again.",

    // settings fragment
    [MessageKeys.settings_title]: "Edit Alarm",
    [MessageKeys.settings_option_profile]: "Profile",
    [MessageKeys.settings_option_smart_alarm]: "Smart Alarm",
    [MessageKeys.settings_option_rem_stim]: "REM Stim",
    [MessageKeys.settings_option_dsl]: "Dawn Simulating Light",
    [MessageKeys.settings_option_alarm_audio]: "Alarm Sound",
    [MessageKeys.settings_option_rem_stim_audio]: "REM Stim Sound",
    [MessageKeys.settings_option_no_audio_selected]: "None",
    // sessions fragment
    [MessageKeys.sessions_title]: sessions,
    [MessageKeys.sessions_toolbar_button_left]: "Prev",
    [MessageKeys.sessions_toolbar_button_right]: "Next",
    // session picker fragment
    [MessageKeys.session_list_title]: "Choose a session",
    // session fragment
    [MessageKeys.session_asleep_time_label]: "asleep at",
    [MessageKeys.session_awake_time_label]: "awake at",
    [MessageKeys.session_sleep_score_label]: "sleep score",
    [MessageKeys.session_sleep_duration_label]: "sleep time",
    [MessageKeys.session_rem_duration_label]: "REM time",
    [MessageKeys.session_deep_duration_label]: "deep time",
    [MessageKeys.session_movement_label]: "Movement",
    [MessageKeys.session_notes_label]: "Notes",
    [MessageKeys.session_notes_hint_text]: "tap to add a note",
    [MessageKeys.session_light_pie_chart_label]: "Light - {0}",
    [MessageKeys.session_deep_pie_chart_label]: "Deep - {0}",
    [MessageKeys.session_rem_pie_chart_label]: "REM - {0}",
    [MessageKeys.session_awake_pie_chart_label]: "Awake - {0}",
    [MessageKeys.session_no_signal_pie_chart_label]: "No Signal - {0}",
    [MessageKeys.session_refresh]: "Session Reload...",
    // account fragment
    [MessageKeys.account_title]: "Account",
    [MessageKeys.account_input_first_name]: input_first_name,
    [MessageKeys.account_input_last_name]: input_last_name,
    [MessageKeys.account_input_birthday]: input_birthday,
    [MessageKeys.account_button]: update,
    [MessageKeys.account_signout]: "Sign Out",
    [MessageKeys.account_loading_message]: "Saving...",
    [MessageKeys.account_success_message]: "Account saved successfully.",
    // sleeping fragment
    [MessageKeys.sleeping_title]: "Sweet dreams...",
    [MessageKeys.sleeping_wakeup_button]: "Wake Up",
    // waking fragment
    [MessageKeys.waking_title]: "Time to wake up!",
    [MessageKeys.waking_wakeup_button]: "Wake Up",
    [MessageKeys.waking_tip_text]:
        "Tip: You can use the Aurora’s button to stop the alarm.",
    // awake fragment
    [MessageKeys.awake_title]: "Good Morning!",
    [MessageKeys.awake_text]:
        "Please answer a few questions about last night’s sleep.",
    [MessageKeys.awake_questionnaire_continue_button]: "Continue",
    [MessageKeys.awake_questionnaire_skip_button]: "Skip",
    [MessageKeys.wip_dialog_title]: "Work in Progress",
    [MessageKeys.wip_dialog_message]:
        "Oops, this feature isn't quite ready for prime time.",
    [MessageKeys.account_not_activated]: "Account not activated.",

    // error required
    [MessageKeys.required]: "{0} field is required.",
    [MessageKeys.passwords_must_match]: "Passwords must match.",
    [MessageKeys.must_agree_to_term_of_use]:
        "You must agree to the terms of use to continue.",
    [MessageKeys.email_already_registered]:
        "This email has already been registered.",

    // alarm sound menu
    [MessageKeys.alarm_sound_dialog_title]: "Choose a sound",

    // profile menu
    [MessageKeys.profile_dialog_title]: "Choose a profile",
};
