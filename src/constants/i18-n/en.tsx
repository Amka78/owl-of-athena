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
    app_name: "Aurora",
    signup: signup,
    login: login,
    male: "Male",
    female: "Female",
    update: update,
    sessions: sessions,
    long_dash: "\u2014",
    pipe_separator: " | ",
    // sleep stages
    stage_awake: "Awake",
    stage_rem: "REM",
    stage_light: "Light Sleep",
    stage_deep: "Deep Sleep",
    // form strings - uppercase since you can't style the hint/label separately
    input_first_name: input_first_name,
    input_last_name: input_last_name,
    input_email: input_email,
    input_password: input_password,
    input_password_confirm: input_password_confirm,
    input_birthday: input_birthday,
    // aurora strings
    aurora_connected: "Aurora connected.",
    aurora_disconnected: "Aurora disconnected.",
    aurora_unsynced_sessions_dialog_title: "Unsynced Sessions Found",
    aurora_unsynced_sessions_dialog_message:
        "Aurora has %1$d unsynced session(s). Would you like to sync now?",
    aurora_low_battery_dialog_title: "Aurora Battery is Low",
    aurora_low_battery_dialog_message:
        "Aurora's battery is at %1$d%%. To ensure the Aurora remains connected through the night, consider charging the battery before continuing.",
    aurora_sync_successful_snackbar_message:
        "Successfully synced %1$d session(s).",
    aurora_sync_successful_snackbar_action: "View Now",
    // welcome fragment
    welcome_title: "Welcome to Aurora!",
    welcome_text:
        "Aurora’s advanced software will help you improve dream recall, achieve sounder sleep,and accelerate your journey towards maximizing your potential. Sweet dreams!",
    welcome_login_button: login,
    welcome_signup_button: signup,
    // login fragment
    login_title: login,
    login_input_email: input_email,
    login_input_password: input_password,
    login_forgot_password_button: "Forgot password?",
    login_no_account_button: "No account yet?",
    login_button: login,
    login_loading_message: "Logging in...",
    login_general_error_message: "Login failed. Invalid email or password.",

    // forgot-password fragment
    forgot_password_title: "Forgot Password?",
    forgot_password_text:
        "Having trouble remembering your password? Input your email address below and we’ll send you instructions to reset it.",
    forgot_password_input_email: input_email,
    forgot_password_button: "Request Reset",

    // signup fragment
    signup_title: signup,
    signup_input_email: input_email,
    signup_input_password: input_password,
    signup_input_password_confirm: input_password_confirm,
    signup_terms: "I agree to the terms of use",
    signup_newsletter: "Keep me updated with Aurora news and developments",
    signup_button: signup,

    // home fragment
    home_default_profile: "Default Profile",
    home_title: "Home",
    home_edit_alarm_button: "Edit Alarm",
    home_go_to_sleep_button: "Go To Sleep",
    home_aurora_disconnected_dialog_title: "Aurora Not Connected",
    home_aurora_disconnected_dialog_message:
        "To connect, please shut down the Aurora if it is on, then turn it back on.",
    home_go_to_sleep_loading_message: "Configuring Aurora&#8230;",
    home_go_to_sleep_error_message:
        "Failed configuring Aurora. Please reset the unit and try again.",

    // settings fragment
    settings_title: "Edit Alarm",
    settings_option_profile: "Profile",
    settings_option_smart_alarm: "Smart Alarm",
    settings_option_rem_stim: "REM Stim",
    settings_option_dsl: "Dawn Simulating Light",
    settings_option_alarm_audio: "Alarm Sound",
    settings_option_rem_stim_audio: "REM Stim Sound",
    settings_option_no_audio_selected: "None",
    // sessions fragment
    sessions_title: sessions,
    sessions_toolbar_button_left: "Prev",
    sessions_toolbar_button_right: "Next",
    // session picker fragment
    session_list_title: "Choose a session",
    // session fragment
    session_asleep_time_label: "asleep at",
    session_awake_time_label: "awake at",
    session_sleep_score_label: "sleep score",
    session_sleep_duration_label: "sleep time",
    session_rem_duration_label: "REM time",
    session_deep_duration_label: "deep time",
    session_movement_label: "Movement",
    session_notes_label: "Notes",
    session_notes_hint_text: "tap to add a note",

    // account fragment
    account_title: "Account",
    account_input_first_name: input_first_name,
    account_input_last_name: input_last_name,
    account_input_birthday: input_birthday,
    account_button: update,
    account_signout: "Sign Out",
    account_loading_message: "Saving...",
    account_success_message: "Account saved successfully.",
    // sleeping fragment
    sleeping_title: "Sweet dreams...",
    sleeping_wakeup_button: "Wake Up",
    // waking fragment
    waking_title: "Time to wake up!",
    waking_wakeup_button: "Wake Up",
    waking_tip_text: "Tip: You can use the Aurora’s button to stop the alarm.",
    // awake fragment
    awake_title: "Good Morning!",
    awake_text: "Please answer a few questions about last night’s sleep.",
    awake_questionnaire_continue_button: "Continue",
    awake_questionnaire_skip_button: "Skip",
    wip_dialog_title: "Work in Progress",
    wip_dialog_message: "Oops, this feature isn't quite ready for prime time.",
    account_not_activated: "Account not activated.",

    // error required
    required: "{0} field is required.",
    passwords_must_match: "Passwords must match.",
    must_agree_to_term_of_use:
        "You must agree to the terms of use to continue.",
    email_already_registered: "This email has already been registered."
};
