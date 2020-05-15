export const MessageKeys = {
    //#region common
    login: "login",
    save: "save",
    cancel: "cancel",
    app_name: "app_name",
    signup: "signup",
    male: "male",
    female: "female",
    update: "update",
    sessions: "sessions",
    long_dash: "long_dash",
    pipe_separator: "pipe_separator",
    //#endregion

    //#region sleep stages
    stage_awake: "stage_awake",
    stage_rem: "stage_rem",
    stage_light: "stage_light",
    stage_deep: "stage_deep",
    //#endregion

    //#region form strings - uppercase since you can't style the hint/label separately
    input_first_name: "input_first_name",
    input_last_name: "input_last_name",
    input_email: "input_email",
    input_password: "input_password",
    input_password_confirm: "input_password_confirm",
    input_birthday: "input_birthday",
    //#endregion

    //#region aurora strings
    aurora_connected: "aurora_connected",
    aurora_disconnected: "aurora_disconnected",
    aurora_unsynced_sessions_dialog_title:
        "aurora_unsynced_sessions_dialog_title",
    aurora_unsynced_sessions_dialog_message:
        "aurora_unsynced_sessions_dialog_message",
    aurora_low_battery_dialog_title: "aurora_low_battery_dialog_title",
    aurora_low_battery_dialog_message: "aurora_low_battery_dialog_message",
    aurora_sync_successful_snackbar_message:
        "aurora_sync_successful_snackbar_message",
    aurora_sync_successful_snackbar_action:
        "aurora_sync_successful_snackbar_action",
    //#endregion

    //#region welcome fragment
    welcome_title: "welcome_title",
    welcome_text: "welcome_text",
    welcome_login_button: "welcome_login_button",
    welcome_signup_button: "welcome_signup_button",
    //#endregion

    //#region login fragment
    login_title: "login_title",
    login_input_email: "login_input_email",
    login_input_password: "login_input_password",
    login_forgot_password_button: "login_forgot_password_button",
    login_no_account_button: "login_no_account_button",
    login_button: "login_button",
    login_loading_message: "login_loading_message",
    login_general_error_message: "login_general_error_message",
    //#endregion

    //#region forgot-password fragment
    forgot_password_title: "forgot_password_title",
    forgot_password_text: "forgot_password_text",
    forgot_password_input_email: "forgot_password_input_email",
    forgot_password_button: "forgot_password_button",
    //#endregion

    //#region signup fragment
    signup_title: "signup_title",
    signup_input_email: "signup_input_email",
    signup_input_password: "signup_input_password",
    signup_input_password_confirm: "signup_input_password_confirm",
    signup_terms: "signup_terms",
    signup_newsletter: "signup_newsletter",
    signup_button: "signup_button",
    //#endregion

    //#region home fragment
    home_default_profile: "home_default_profile",
    home_title: "home_title",
    home_edit_alarm_button: "home_edit_alarm_button",
    home_go_to_sleep_button: "home_go_to_sleep_button",
    home_aurora_disconnected_dialog_title:
        "home_aurora_disconnected_dialog_title",
    home_aurora_disconnected_dialog_message:
        "home_aurora_disconnected_dialog_message",
    home_go_to_sleep_loading_message: "home_go_to_sleep_loading_message",
    home_go_to_sleep_error_message: "home_go_to_sleep_error_message",
    //#endregion

    //#region settings fragment
    settings_title: "settings_title",
    settings_option_profile: "settings_option_profile",
    settings_option_smart_alarm: "settings_option_smart_alarm",
    settings_option_rem_stim: "settings_option_rem_stim",
    settings_option_dsl: "settings_option_dsl",
    settings_option_alarm_audio: "settings_option_alarm_audio",
    settings_option_rem_stim_audio: "settings_option_rem_stim_audio",
    settings_option_no_audio_selected: "settings_option_no_audio_selected",
    //#endregion

    //#region  sessions fragment
    sessions_title: "sessions_title",
    sessions_toolbar_button_left: "sessions_toolbar_button_left",
    sessions_toolbar_button_right: "sessions_toolbar_button_right",
    sessions_filter_by_date_label: "sessions_filter_by_date_label",
    sessions_picker_values_any_time: "sessions_picker_value_any_time",
    sessions_picker_values_past_week: "sessions_picker_value_past_week",
    sessions_picker_values_past_month: "sessions_picker_value_past_month",
    sessions_check_show_starred_label: "sessions_check_show_starred_label",
    sessions_check_show_starred_description:
        "sessions_check_show_starred_description",
    sessions_check_show_notes_label: "sessions_check_show_notes_label",
    sessions_check_show_notes_description:
        "sessions_check_show_notes_description",
    //#endregion

    //#region session picker fragment
    session_list_title: "session_list_title",
    //#endregion

    //#region  session fragment
    session_asleep_time_label: "session_asleep_time_label",
    session_awake_time_label: "session_awake_time_label",
    session_sleep_score_label: "session_sleep_score_label",
    session_sleep_duration_label: "session_sleep_duration_label",
    session_rem_duration_label: "session_rem_duration_label",
    session_deep_duration_label: "session_deep_duration_label",
    session_movement_label: "session_movement_label",
    session_notes_label: "session_notes_label",
    session_notes_hint_text: "session_notes_hint_text",
    session_light_pie_chart_label: "session_light_pie_chart_label",
    session_deep_pie_chart_label: "session_deep_pie_chart_label",
    session_rem_pie_chart_label: "session_rem_pie_chart_label",
    session_awake_pie_chart_label: "session_awake_pie_chart_label",
    session_no_signal_pie_chart_label: "session_no_signal_pie_chart_label",
    session_reloading: "session_reloading",
    //#endregion

    //#region account fragment
    account_title: "account_title",
    account_input_first_name: "account_input_first_name",
    account_input_last_name: "account_input_last_name",
    account_input_birthday: "account_input_birthday",
    account_button: "account_button",
    account_signout: "account_signout",
    account_loading_message: "account_loading_message",
    account_success_message: "account_success_message",
    //#endregion

    //#region sleeping fragment
    sleeping_title: "sleeping_title",
    sleeping_wakeup_button: "sleeping_wakeup_button",
    //#endregion

    //#region waking fragment
    waking_title: "waking_title",
    waking_wakeup_button: "waking_wakeup_button",
    waking_tip_text: "waking_tip_text",
    //#endregion

    //#region awake fragment
    awake_title: "awake_title",
    awake_text: "awake_text",
    awake_questionnaire_continue_button: "awake_questionnaire_continue_button",
    awake_questionnaire_skip_button: "awake_questionnaire_skip_button",
    wip_dialog_title: "wip_dialog_title",
    wip_dialog_message: "wip_dialog_message",
    account_not_activated: "account_not_activated",
    //#endregion

    //#region error required
    required: "required",
    passwords_must_match: "passwords_must_match",
    must_agree_to_term_of_use: "must_agree_to_term_of_use",
    email_already_registered: "email_already_registered",
    //#endregion

    //#region alarm sound menu
    alarm_sound_dialog_title: "alarm_sound_dialog_title",
    profile_dialog_title: "profile_dialog_title",
    //#endregion

    //#region update snack bar
    update_snack_bar_title: "update_snack_bar_title",
    update_snack_bar_action_label: "update_snack_bar_action_label",
    //#endregion

    //#region delete confirm dialog
    delete_dialog_title: "delete_dialog_title",
    delete_dialog_message: "delete_dialog_message",
    //#endregion

    //#region top tab titles
    top_tab_sleep_tracking_title: "top_tab_sleep_tracking_title",
    top_tab_journal_title: "top_tab_journal_title",
    //#endregion

    //#region date format
    date_format: "date_format",
};
