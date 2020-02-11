const login = "ログイン";
const signup = "サインアップ";
const input_email = "Eメールアドレス";
const input_password = "パスワード";
const input_password_confirm = "パスワード再入力";
const sessions = "セッションズ";
const input_first_name = "名";
const input_last_name = "姓";
const input_birthday = "誕生日";
const update = "更新";
export default {
    app_name: "Aurora",
    signup: signup,
    login: login,
    male: "男性",
    female: "女性",
    update: update,
    sessions: sessions,
    long_dash: "\u2014",
    pipe_separator: " | ",
    // sleep stages
    stage_awake: "起床中",
    stage_rem: "REM",
    stage_light: "浅い眠り",
    stage_deep: "深い眠り",
    // form strings - uppercase since you can't style the hint/label separately
    input_first_name: input_first_name,
    input_last_name: input_last_name,
    input_email: input_email,
    input_password: input_password,
    input_password_confirm: input_password_confirm,
    input_birthday: input_birthday,
    // aurora strings
    aurora_connected: "Aurora接続中.",
    aurora_disconnected: "Aurora切断済み.",
    aurora_unsynced_sessions_dialog_title:
        "同期されていないセッションを見つけました。",
    aurora_unsynced_sessions_dialog_message:
        "Auroraには%1$dの非同期セッションがあります。今から同期しますか?",
    aurora_low_battery_dialog_title: "Auroraのバッテリーがとても少ないです。",
    aurora_low_battery_dialog_message:
        "Auroraのバッテリーが%1$d%%です。 一晩オーロラを動作させたい場合は充電をしてください。",
    aurora_sync_successful_snackbar_message:
        "%1$dのセッションの同期に成功しました。",
    aurora_sync_successful_snackbar_action: "今見る。",
    // welcome fragment
    welcome_title: "Auroraにようこそ！",
    welcome_text:
        "このソフトウェアは貴方のドリームリコールを向上させます。より良い睡眠を実現し、明晰夢を体験する可能性があがります。 良い夢を!",
    welcome_login_button: login,
    welcome_signup_button: signup,
    // login fragment
    login_title: login,
    login_input_email: input_email,
    login_input_password: input_password,
    login_forgot_password_button: "パスワードを忘れましたか?",
    login_no_account_button: "アカウントが未作成ですか?",
    login_button: login,
    login_loading_message: "ログイン中",
    login_general_error_message:
        "ログインに失敗しました。 Eメールかパスワードが間違っています。",

    // forgot-password fragment
    forgot_password_title: "パスワードを忘れましたか?",
    forgot_password_text:
        "パスワードを思い出せませんか? \r下記にEメールアドレスを入力すれば、パスワードのリセット方法をお知らせします。",
    forgot_password_input_email: input_email,
    forgot_password_button: "Reset",

    // signup fragment
    signup_title: signup,
    signup_input_email: input_email,
    signup_input_password: input_password,
    signup_input_password_confirm: input_password_confirm,
    signup_terms: "私は利用規約を了承しました。",
    signup_newsletter: "Auroraのニュースと最新の開発状況を取得する。",
    signup_button: signup,

    // home fragment
    home_default_profile: "ディフォルト プロファイル",
    home_title: "ホーム",
    home_edit_alarm_button: "アラームを更新",
    home_go_to_sleep_button: "眠る",
    home_aurora_disconnected_dialog_title: "Auroraが接続されていません。",
    home_aurora_disconnected_dialog_message:
        "接続してください、 もしAuroraの電源がオンの場合一旦オフにし, 起動してください。",
    home_go_to_sleep_loading_message: "Aurora設定中&#8230;",
    home_go_to_sleep_error_message:
        "Auroraの設定中です。 Aurora再起動し、再度実行してください。",

    // settings fragment
    settings_title: "Alarmを更新する",
    settings_option_profile: "プロフィール",
    settings_option_smart_alarm: "スマートアラーム",
    settings_option_rem_stim: "REM睡眠を知らせる",
    settings_option_dsl: "夜明けをシミュレーションする光",
    settings_option_alarm_audio: "アラームサウンド",
    settings_option_rem_stim_audio: "REM睡眠通知サウンド",
    settings_option_no_audio_selected: "なし",
    // sessions fragment
    sessions_title: sessions,
    sessions_toolbar_button_left: "前へ",
    sessions_toolbar_button_right: "次へ",
    // session picker fragment
    session_list_title: "セッションを選んでください。",
    // session fragment
    session_asleep_time_label: "入眠",
    session_awake_time_label: "起床",
    session_sleep_score_label: "スリープ・スコア",
    session_sleep_duration_label: "睡眠時間",
    session_rem_duration_label: "REM睡眠",
    session_deep_duration_label: "深い眠り",
    session_movement_label: "ムーブメント",
    session_notes_label: "ノート",
    session_notes_hint_text: "タップして、ノートを追加します。",

    // account fragment
    account_title: "アカウント",
    account_input_first_name: input_first_name,
    account_input_last_name: input_last_name,
    account_input_birthday: input_birthday,
    account_button: update,
    account_signout: "サインアウト",
    account_loading_message: "セーブ中",
    account_success_message: "アカウントの保存に成功しました。.",
    // sleeping fragment
    sleeping_title: "よい夢を...",
    sleeping_wakeup_button: "起きる",
    // waking fragment
    waking_title: "起きてください!",
    waking_wakeup_button: "起きる",
    waking_tip_text: "Tip: アラームを止めるためにAuroraのボタンが使えます。",
    // awake fragment
    awake_title: "おはようございます!",
    awake_text: "昨日の夜に対する幾つかの質問に答えてください。",
    awake_questionnaire_continue_button: "続ける",
    awake_questionnaire_skip_button: "スキップ",
    wip_dialog_title: "進行中",
    wip_dialog_message: "おっと、この機能は、まだ利用不可能です。",
    account_not_activated: "アカウント認証が完了していません。",

    // error required
    required: "{0}は必須入力です。",
    passwords_must_match: "パスワードは一致している必要があります。",
    must_agree_to_term_of_use:
        "サインアップするには利用規約に同意する必要があります。",
    email_already_registered: "すでに入力済みのメールアドレスです。"
};
