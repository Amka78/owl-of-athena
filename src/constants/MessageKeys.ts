export const MessageKeys = {
    //#region Common
    login: "login",
    save: "save",
    save_as_new: "save_as_new",
    overwrite_save: "overwrite_save",
    ok: "ok",
    cancel: "cancel",
    app_name: "app_name",
    signup: "signup",
    male: "male",
    female: "female",
    update: "update",
    session: "session",
    sessions: "sessions",
    profile: "profile",
    profiles: "profiles",
    long_dash: "long_dash",
    pipe_separator: "pipe_separator",
    reloading: "reloading",
    preview: "preview",
    //#endregion

    //#region Sleep stages
    stage_awake: "stage_awake",
    stage_rem: "stage_rem",
    stage_light: "stage_light",
    stage_deep: "stage_deep",
    //#endregion

    //#region Form strings - uppercase since you can't style the hint/label separately
    input_first_name: "input_first_name",
    input_last_name: "input_last_name",
    input_email: "input_email",
    input_password: "input_password",
    input_password_confirm: "input_password_confirm",
    input_birthday: "input_birthday",
    //#endregion

    //#region Aurora strings
    aurora_connected: "aurora_connected",
    aurora_disconnected: "aurora_disconnected",
    aurora_unsynced_sessions_dialog_title: "aurora_unsynced_sessions_dialog_title",
    aurora_unsynced_sessions_dialog_message: "aurora_unsynced_sessions_dialog_message",
    aurora_low_battery_dialog_title: "aurora_low_battery_dialog_title",
    aurora_low_battery_dialog_message: "aurora_low_battery_dialog_message",
    aurora_sync_successful_snackbar_message: "aurora_sync_successful_snackbar_message",
    aurora_sync_successful_snackbar_action: "aurora_sync_successful_snackbar_action",
    //#endregion

    //#region WelcomeScreen
    welcome_title: "welcome_title",
    welcome_text: "welcome_text",
    welcome_login_button: "welcome_login_button",
    welcome_signup_button: "welcome_signup_button",
    welcome_standalone_button: "welcome_standalone_button",
    //#endregion

    //#region LoginScreen
    login_title: "login_title",
    login_input_email: "login_input_email",
    login_input_password: "login_input_password",
    login_forgot_password_button: "login_forgot_password_button",
    login_no_account_button: "login_no_account_button",
    login_button: "login_button",
    login_loading_message: "login_loading_message",
    login_general_error_message: "login_general_error_message",
    //#endregion

    //#region Forgot-passwordScreen
    forgot_password_title: "forgot_password_title",
    forgot_password_text: "forgot_password_text",
    forgot_password_input_email: "forgot_password_input_email",
    forgot_password_button: "forgot_password_button",
    //#endregion

    //#region SignupScreen
    signup_title: "signup_title",
    signup_input_email: "signup_input_email",
    signup_input_password: "signup_input_password",
    signup_input_password_confirm: "signup_input_password_confirm",
    signup_terms: "signup_terms",
    signup_newsletter: "signup_newsletter",
    signup_button: "signup_button",
    //#endregion

    //#region HomeScreen
    home_default_profile: "home_default_profile",
    home_title: "home_title",
    home_edit_alarm_button: "home_edit_alarm_button",
    home_go_to_sleep_button: "home_go_to_sleep_button",
    home_aurora_disconnected_dialog_title: "home_aurora_disconnected_dialog_title",
    home_aurora_disconnected_dialog_message: "home_aurora_disconnected_dialog_message",
    home_go_to_sleep_loading_message: "home_go_to_sleep_loading_message",
    home_go_to_sleep_error_message: "home_go_to_sleep_error_message",
    //#endregion

    //#region SettingsScreen
    settings_title: "settings_title",
    settings_option_profile: "settings_option_profile",
    settings_option_smart_alarm: "settings_option_smart_alarm",
    settings_option_rem_stim: "settings_option_rem_stim",
    settings_option_dsl: "settings_option_dsl",
    settings_option_alarm_audio: "settings_option_alarm_audio",
    settings_option_rem_stim_audio: "settings_option_rem_stim_audio",
    settings_option_no_audio_selected: "settings_option_no_audio_selected",
    //#endregion

    //#region  SessionListScreen
    sessions_title: "sessions_title",
    sessions_toolbar_button_left: "sessions_toolbar_button_left",
    sessions_toolbar_button_right: "sessions_toolbar_button_right",
    sessions_filter_by_date_label: "sessions_filter_by_date_label",
    sessions_picker_values_any_time: "sessions_picker_value_any_time",
    sessions_picker_values_past_week: "sessions_picker_value_past_week",
    sessions_picker_values_past_month: "sessions_picker_value_past_month",
    sessions_check_show_starred_label: "sessions_check_show_starred_label",
    sessions_check_show_starred_description: "sessions_check_show_starred_description",
    sessions_check_show_notes_label: "sessions_check_show_notes_label",
    sessions_check_show_notes_description: "sessions_check_show_notes_description",
    //#endregion

    //#region Session picker fragment
    choose: "session_list_title",
    //#endregion

    //#region SessionScreen
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
    //#endregion

    //#region AccountScreen
    account_title: "account_title",
    account_input_first_name: "account_input_first_name",
    account_input_last_name: "account_input_last_name",
    account_input_birthday: "account_input_birthday",
    account_button: "account_button",
    account_signout: "account_signout",
    account_loading_message: "account_loading_message",
    account_success_message: "account_success_message",
    //#endregion

    //#region SleepingScreen
    sleeping_title: "sleeping_title",
    sleeping_wakelock: "sleeping_wakelock",
    sleeping_wakeunlock: "sleeping_wakeunlock",
    sleeping_wakeup_button: "sleeping_wakeup_button",
    //#endregion

    //#region WakingScreen
    waking_title: "waking_title",
    waking_wakeup_button: "waking_wakeup_button",
    waking_tip_text: "waking_tip_text",
    //#endregion

    //#region AwakeScreen
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
    emails_must_match: "emails_must_match",
    must_agree_to_term_of_use: "must_agree_to_term_of_use",
    email_already_registered: "email_already_registered",
    //#endregion

    //#region Alarm sound menu
    alarm_sound_dialog_title: "alarm_sound_dialog_title",
    profile_dialog_title: "profile_dialog_title",
    //#endregion

    //#region Update snack bar
    update_snack_bar_title: "update_snack_bar_title",
    update_snack_bar_action_label: "update_snack_bar_action_label",
    //#endregion

    //#region Delete confirm dialog
    delete_dialog_title: "delete_dialog_title",
    delete_dialog_message: "delete_dialog_message",
    //#endregion

    //#region Top tab titles
    top_tab_sleep_tracking_title: "top_tab_sleep_tracking_title",
    top_tab_journal_title: "top_tab_journal_title",
    top_tab_profile_edit_title: "top_tab_profile_edit_title",
    top_tab_profile_preview_title: "top_tab_profile_preview_title",
    //#endregion

    //#region Date format
    date_format: "date_format",
    //#endregion

    //#region Standalone mode confirm dialog
    standalone_mode_confirm_title: "standalone_mode_confirm_title",
    standalone_mode_confirm_message: "standalone_mode_confirm_message",
    //#endregion

    //#region Drawer items label
    drawer_items_main: "drawer_items_main",
    drawer_items_sessions: "drawer_items_sessions",
    drawer_items_profiles: "drawer_items_profiles",
    drawer_items_account: "drawer_items_account",
    //#endregion

    //#region Profile filter menu
    profile_filter_menu_header_label: "profile_filter_menu_header_label",
    profile_filter_menu_official_check_box_label: "profile_filter_menu_official_check_box_label",
    profile_filter_menu_official_check_box_description:
        "profile_filter_menu_official_check_box_description",
    profile_filter_menu_private_check_box_label: "profile_filter_menu_private_check_box_label",
    profile_filter_menu_private_check_box_description:
        "profile_filter_menu_private_check_box_description",
    profile_filter_menu_community_check_box_label: "profile_filter_menu_community_check_box_label",
    profile_filter_menu_community_check_box_description:
        "profile_filter_menu_community_check_box_description",
    //#endregion

    //#region ProfileScreens
    profile_rem_stim_options: "profile_rem_stim_options",
    profile_alarm_options: "profile_alarm_options",
    profile_misc_options: "profile_misc_options",
    profile_save_to_aurora: "save_to_aurora",
    profile_show_advanced_options: "show_advanced_options",
    //#endregion

    //#region ConfirmEmailScreen
    confirm_email_title: "confirm_email_title",
    confirm_email_text: "confirm_email_text",
    confirm_email_check_button: "confirm_email_check_button",
    confirm_email_resend_button: "confirm_email_resend_button",
    confirm_email_change_email_button: "confirm_email_change_email_button",
    confirm_email_not_verified: "confirm_email_not_verified",
    confirm_email_resent: "confirm_email_resent",
    //#endregion

    //#region ForgotPassword success
    forgot_password_success: "forgot_password_success",
    //#endregion

    //#region SleepingScreen snooze
    sleeping_snooze_button: "sleeping_snooze_button",
    sleeping_snoozing_message: "sleeping_snoozing_message",
    //#endregion

    //#region SettingsScreen volume
    settings_option_volume: "settings_option_volume",
    //#endregion

    connection_error: "connection_error",
    session_blank: "session_blank",

    lef_effect: "led_effect",
    effect: "effect",
    no_effect: "no_effect",

    set: "set",
    blink: "blink",
    alternate: "alternate",
    transition: "transition",

    //#region Admin screens
    admin_title: "admin_title",
    admin_users_title: "admin_users_title",
    admin_orders_title: "admin_orders_title",
    admin_sessions_title: "admin_sessions_title",
    admin_issues_title: "admin_issues_title",
    admin_messages_title: "admin_messages_title",
    admin_app_settings_title: "admin_app_settings_title",
    drawer_items_admin: "drawer_items_admin",
    //#endregion

    //#region Account Messages
    account_messages_title: "account_messages_title",
    //#endregion

    //#region Account Roles
    account_roles_title: "account_roles_title",
    //#endregion

    //#region Console screen
    console_title: "console_title",
    console_input_placeholder: "console_input_placeholder",
    console_send_button: "console_send_button",
    console_clear_button: "console_clear_button",
    console_not_connected: "console_not_connected",
    //#endregion

    //#region Messages screen
    messages_mark_as_read: "messages_mark_as_read",
    messages_read_label: "messages_read_label",
    messages_unread_label: "messages_unread_label",
    messages_begin_questionnaire: "messages_begin_questionnaire",
    messages_continue_questionnaire: "messages_continue_questionnaire",
    messages_save_for_later: "messages_save_for_later",
    messages_already_completed: "messages_already_completed",
    messages_no_messages: "messages_no_messages",
    //#endregion

    //#region Issue report dialog
    issue_report_title: "issue_report_title",
    issue_report_input_title: "issue_report_input_title",
    issue_report_input_description: "issue_report_input_description",
    issue_report_input_reproduce_steps: "issue_report_input_reproduce_steps",
    issue_report_check_critical: "issue_report_check_critical",
    issue_report_check_anonymous: "issue_report_check_anonymous",
    issue_report_send_button: "issue_report_send_button",
    issue_report_success: "issue_report_success",
    issue_report_error: "issue_report_error",
    issue_report_button: "issue_report_button",
    //#endregion

    //#region Session transfer dialog
    session_transfer_title: "session_transfer_title",
    session_transfer_scanning: "session_transfer_scanning",
    session_transfer_not_connected: "session_transfer_not_connected",
    session_transfer_no_sessions: "session_transfer_no_sessions",
    session_transfer_transferring: "session_transfer_transferring",
    session_transfer_complete: "session_transfer_complete",
    session_transfer_button: "session_transfer_button",
    session_transfer_cancel: "session_transfer_cancel",
    session_transfer_continue: "session_transfer_continue",
    session_transfer_delete_confirm_title: "session_transfer_delete_confirm_title",
    session_transfer_delete_confirm_message: "session_transfer_delete_confirm_message",
    //#endregion

    //#region Questionnaire dialog
    questionnaire_begin_button: "questionnaire_begin_button",
    questionnaire_next_button: "questionnaire_next_button",
    questionnaire_previous_button: "questionnaire_previous_button",
    questionnaire_complete_title: "questionnaire_complete_title",
    questionnaire_close_button: "questionnaire_close_button",
    questionnaire_loading: "questionnaire_loading",
    questionnaire_error: "questionnaire_error",
    //#endregion

    //#region Change password screen
    change_password_title: "change_password_title",
    change_password_input_new_password: "change_password_input_new_password",
    change_password_input_confirm_password: "change_password_input_confirm_password",
    change_password_button: "change_password_button",
    change_password_success: "change_password_success",
    change_password_nav_button: "change_password_nav_button",
    change_password_warning: "change_password_warning",
    //#endregion

    //#region Change email screen
    change_email_title: "change_email_title",
    change_email_input_new_email: "change_email_input_new_email",
    change_email_input_confirm_email: "change_email_input_confirm_email",
    change_email_button: "change_email_button",
    change_email_success: "change_email_success",
    change_email_nav_button: "change_email_nav_button",
    change_email_warning: "change_email_warning",
    //#endregion

    //#region Profile edit dialog
    profile_edit_title: "profile_edit_title",
    profile_edit_input_title: "profile_edit_input_title",
    profile_edit_input_description: "profile_edit_input_description",
    profile_edit_button: "profile_edit_button",
    //#endregion

    //#region Aurora info dialog
    aurora_info_title: "aurora_info_title",
    aurora_info_firmware: "aurora_info_firmware",
    aurora_info_bootloader: "aurora_info_bootloader",
    aurora_info_ble: "aurora_info_ble",
    aurora_info_bootstrap: "aurora_info_bootstrap",
    aurora_info_battery: "aurora_info_battery",
    //#endregion
};
