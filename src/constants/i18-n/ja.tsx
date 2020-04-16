import { MessageKeys } from "../MessageKeys";
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
    [MessageKeys.app_name]: "Aurora",
    [MessageKeys.save]: "保存",
    [MessageKeys.cancel]: "キャンセル",
    [MessageKeys.signup]: signup,
    [MessageKeys.login]: login,
    [MessageKeys.male]: "男性",
    [MessageKeys.female]: "女性",
    [MessageKeys.update]: update,
    [MessageKeys.sessions]: sessions,
    [MessageKeys.long_dash]: "\u2014",
    [MessageKeys.pipe_separator]: " | ",
    // sleep stages
    [MessageKeys.stage_awake]: "起床中",
    [MessageKeys.stage_rem]: "REM",
    [MessageKeys.stage_light]: "浅い眠り",
    [MessageKeys.stage_deep]: "深い眠り",
    // form strings - uppercase since you can't style the hint/label separately
    [MessageKeys.input_first_name]: input_first_name,
    [MessageKeys.input_last_name]: input_last_name,
    [MessageKeys.input_email]: input_email,
    [MessageKeys.input_password]: input_password,
    [MessageKeys.input_password_confirm]: input_password_confirm,
    [MessageKeys.input_birthday]: input_birthday,
    // aurora strings
    [MessageKeys.aurora_connected]: "Aurora接続中.",
    [MessageKeys.aurora_disconnected]: "Aurora切断済み.",
    [MessageKeys.aurora_unsynced_sessions_dialog_title]:
        "同期されていないセッションを見つけました。",
    [MessageKeys.aurora_unsynced_sessions_dialog_message]:
        "Auroraには{0}の非同期セッションがあります。今から同期しますか?",
    [MessageKeys.aurora_low_battery_dialog_title]:
        "Auroraのバッテリーがとても少ないです。",
    [MessageKeys.aurora_low_battery_dialog_message]:
        "Auroraのバッテリーが{0}%です。 一晩オーロラを動作させたい場合は充電をしてください。",
    [MessageKeys.aurora_sync_successful_snackbar_message]:
        "{0}のセッションの同期に成功しました。",
    [MessageKeys.aurora_sync_successful_snackbar_action]: "今見る。",
    // welcome fragment
    [MessageKeys.welcome_title]: "Auroraにようこそ！",
    [MessageKeys.welcome_text]:
        "このソフトウェアは貴方のドリームリコールを向上させます。より良い睡眠を実現し、明晰夢を体験する可能性があがります。 良い夢を!",
    [MessageKeys.welcome_login_button]: login,
    [MessageKeys.welcome_signup_button]: signup,
    // login fragment
    [MessageKeys.login_title]: login,
    [MessageKeys.login_input_email]: input_email,
    [MessageKeys.login_input_password]: input_password,
    [MessageKeys.login_forgot_password_button]: "パスワードを忘れましたか?",
    [MessageKeys.login_no_account_button]: "アカウントが未作成ですか?",
    [MessageKeys.login_button]: login,
    [MessageKeys.login_loading_message]: "ログイン中",
    [MessageKeys.login_general_error_message]:
        "ログインに失敗しました。 Eメールかパスワードが間違っています。",

    // forgot-password fragment
    [MessageKeys.forgot_password_title]: "パスワードを忘れましたか?",
    [MessageKeys.forgot_password_text]:
        "パスワードを思い出せませんか? \r下記にEメールアドレスを入力すれば、パスワードのリセット方法をお知らせします。",
    [MessageKeys.forgot_password_input_email]: input_email,
    [MessageKeys.forgot_password_button]: "Reset",

    // signup fragment
    [MessageKeys.signup_title]: signup,
    [MessageKeys.signup_input_email]: input_email,
    [MessageKeys.signup_input_password]: input_password,
    [MessageKeys.signup_input_password_confirm]: input_password_confirm,
    [MessageKeys.signup_terms]: "私は利用規約を了承しました。",
    [MessageKeys.signup_newsletter]:
        "Auroraのニュースと最新の開発状況を取得する。",
    [MessageKeys.signup_button]: signup,

    // home fragment
    [MessageKeys.home_default_profile]: "ディフォルト プロファイル",
    [MessageKeys.home_title]: "ホーム",
    [MessageKeys.home_edit_alarm_button]: "アラームを更新",
    [MessageKeys.home_go_to_sleep_button]: "眠る",
    [MessageKeys.home_aurora_disconnected_dialog_title]:
        "Auroraが接続されていません。",
    [MessageKeys.home_aurora_disconnected_dialog_message]:
        "接続してください、 もしAuroraの電源がオンの場合一旦オフにし, 起動してください。",
    [MessageKeys.home_go_to_sleep_loading_message]: "Aurora設定中...",
    [MessageKeys.home_go_to_sleep_error_message]:
        "Auroraの設定中です。 Aurora再起動し、再度実行してください。",

    // settings fragment
    [MessageKeys.settings_title]: "Alarmを更新する",
    [MessageKeys.settings_option_profile]: "プロフィール",
    [MessageKeys.settings_option_smart_alarm]: "スマートアラーム",
    [MessageKeys.settings_option_rem_stim]: "REM睡眠を知らせる",
    [MessageKeys.settings_option_dsl]: "夜明けをシミュレーションする光",
    [MessageKeys.settings_option_alarm_audio]: "アラームサウンド",
    [MessageKeys.settings_option_rem_stim_audio]: "REM睡眠通知サウンド",
    [MessageKeys.settings_option_no_audio_selected]: "なし",
    // sessions fragment
    [MessageKeys.sessions_title]: sessions,
    [MessageKeys.sessions_toolbar_button_left]: "前へ",
    [MessageKeys.sessions_toolbar_button_right]: "次へ",
    [MessageKeys.sessions_filter_by_date_label]: "日付で絞り込む",
    [MessageKeys.sessions_picker_values_any_time]: "全て",
    [MessageKeys.sessions_picker_values_past_week]: "1週間",
    [MessageKeys.sessions_picker_values_past_month]: "1ヵ月",
    [MessageKeys.sessions_check_show_starred_label]: "星付きを表示",
    [MessageKeys.sessions_check_show_starred_description]:
        "星付きのセッションのみ表示します。",
    [MessageKeys.sessions_check_show_notes_label]: "ノートを表示",
    [MessageKeys.sessions_check_show_notes_description]:
        "ノートを記述しているセッションのみ表示します。",

    // session picker fragment
    [MessageKeys.session_list_title]: "セッションを選んでください。",
    // session fragment
    [MessageKeys.session_asleep_time_label]: "入眠",
    [MessageKeys.session_awake_time_label]: "起床",
    [MessageKeys.session_sleep_score_label]: "スリープ・スコア",
    [MessageKeys.session_sleep_duration_label]: "睡眠時間",
    [MessageKeys.session_rem_duration_label]: "REM睡眠",
    [MessageKeys.session_deep_duration_label]: "深い眠り",
    [MessageKeys.session_movement_label]: "ムーブメント",
    [MessageKeys.session_notes_label]: "ノート",
    [MessageKeys.session_notes_hint_text]: "タップして、ノートを追加します。",
    [MessageKeys.session_reloading]: "セッション再読み込み中...",
    // account fragment
    [MessageKeys.account_title]: "アカウント",
    [MessageKeys.account_input_first_name]: input_first_name,
    [MessageKeys.account_input_last_name]: input_last_name,
    [MessageKeys.account_input_birthday]: input_birthday,
    [MessageKeys.account_button]: update,
    [MessageKeys.account_signout]: "サインアウト",
    [MessageKeys.account_loading_message]: "セーブ中",
    [MessageKeys.account_success_message]: "アカウントの保存に成功しました。.",
    // sleeping fragment
    [MessageKeys.sleeping_title]: "よい夢を...",
    [MessageKeys.sleeping_wakeup_button]: "起きる",
    // waking fragment
    [MessageKeys.waking_title]: "起きてください!",
    [MessageKeys.waking_wakeup_button]: "起きる",
    [MessageKeys.waking_tip_text]:
        "Tip: アラームを止めるためにAuroraのボタンが使えます。",
    // awake fragment
    [MessageKeys.awake_title]: "おはようございます!",
    [MessageKeys.awake_text]: "昨日の夜に対する幾つかの質問に答えてください。",
    [MessageKeys.awake_questionnaire_continue_button]: "続ける",
    [MessageKeys.awake_questionnaire_skip_button]: "スキップ",
    [MessageKeys.wip_dialog_title]: "進行中",
    wip_dialog_message: "おっと、この機能は、まだ利用不可能です。",
    [MessageKeys.account_not_activated]: "アカウント認証が完了していません。",

    // error required
    [MessageKeys.required]: "{0}は必須入力です。",
    [MessageKeys.passwords_must_match]:
        "パスワードは一致している必要があります。",
    [MessageKeys.must_agree_to_term_of_use]:
        "サインアップするには利用規約に同意する必要があります。",
    [MessageKeys.email_already_registered]:
        "すでに入力済みのメールアドレスです。",

    // alarm sound menu
    [MessageKeys.alarm_sound_dialog_title]: "目覚まし用の音を選んでください。",

    [MessageKeys.profile_dialog_title]: "プロファイルを選んでください。",
};
