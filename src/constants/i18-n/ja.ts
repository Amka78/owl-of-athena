import { MessageKeys } from "../MessageKeys";

const login = "ログイン";
const signup = "サインアップ";
const input_email = "Eメールアドレス";
const input_password = "パスワード";
const input_password_confirm = "パスワード再入力";
const profile = "プロファイル";
const profiles = "プロファイルズ";
const session = "セッション";
const sessions = "セッションズ";
const input_first_name = "名";
const input_last_name = "姓";
const input_birthday = "誕生日";
const update = "更新";
export default {
    [MessageKeys.app_name]: "Aurora",
    [MessageKeys.save]: "保存",
    [MessageKeys.save_as_new]: "新規保存",
    [MessageKeys.overwrite_save]: "上書き保存",
    [MessageKeys.cancel]: "キャンセル",
    [MessageKeys.signup]: signup,
    [MessageKeys.login]: login,
    [MessageKeys.male]: "男性",
    [MessageKeys.female]: "女性",
    [MessageKeys.update]: update,
    [MessageKeys.session]: session,
    [MessageKeys.sessions]: sessions,
    [MessageKeys.profile]: profile,
    [MessageKeys.profiles]: profiles,
    [MessageKeys.long_dash]: "\u2014",
    [MessageKeys.pipe_separator]: " | ",
    [MessageKeys.reloading]: "{0} 再読み込み中...",
    [MessageKeys.preview]: "{0}を確認",
    [MessageKeys.offline_banner_message]: "オフラインです。一部の機能は利用できません。",
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
    [MessageKeys.choose]: "{0}を選んでください。",
    // aurora strings
    [MessageKeys.aurora_connected]: "Aurora:接続中 バージョン:{0} バッテリー{1}%",
    [MessageKeys.aurora_disconnected]: "Aurora切断済み.",
    [MessageKeys.aurora_unsynced_sessions_dialog_title]:
        "同期されていないセッションを見つけました。",
    [MessageKeys.aurora_unsynced_sessions_dialog_message]:
        "Auroraには{0}の非同期セッションがあります。今から同期しますか?",
    [MessageKeys.aurora_low_battery_dialog_title]: "Auroraのバッテリーがとても少ないです。",
    [MessageKeys.aurora_low_battery_dialog_message]:
        "Auroraのバッテリーが{0}%です。 一晩オーロラを動作させたい場合は充電をしてください。",
    [MessageKeys.aurora_sync_successful_snackbar_message]: "{0}のセッションの同期に成功しました。",
    [MessageKeys.aurora_sync_successful_snackbar_action]: "今見る。",
    [MessageKeys.aurora_sync_mixed_message]:
        "{0}件のセッションを同期しましたが、{1}件は同期できませんでした。",
    [MessageKeys.aurora_sync_failed_message]:
        "{0}件のセッションを同期できませんでした。時間をおいて再度お試しください。",
    [MessageKeys.aurora_sync_dialog_title]: "セッションの同期",
    [MessageKeys.aurora_wakeup_battery_low_title]: "おはようございます!",
    [MessageKeys.aurora_wakeup_battery_low_message]:
        "Auroraのバッテリーが切れたため、今回のセッションは同期できませんでした。充電後にアプリが接続したときに同期されます。",
    // welcome fragment
    [MessageKeys.alarm_notification_title]: "起きる時間です!",
    [MessageKeys.alarm_notification_body]:
        "Auroraのアラームが鳴っています。この通知からスヌーズか起床を選べます。",
    [MessageKeys.alarm_notification_snooze]: "スヌーズ",
    [MessageKeys.alarm_notification_wakeup]: "起きる",
    [MessageKeys.firmware_update_title]: "ファームウェアの更新があります",
    [MessageKeys.firmware_update_message]:
        "Auroraのファームウェア {0} が公開されています。今すぐ更新しますか? 更新中はAuroraの電源を切ったり、離したりしないでください。",
    [MessageKeys.firmware_update_flashing]:
        "ファームウェアを更新しています。Auroraの電源を切ったり、アプリを閉じたりしないでください。",
    [MessageKeys.firmware_update_success]: "ファームウェアを {0} に更新しました。",
    [MessageKeys.firmware_update_failed]: "ファームウェアの更新に失敗しました: {0}",
    [MessageKeys.firmware_update_battery_low]:
        "更新の前にAuroraを充電してください。電池が少ない状態で更新すると、端末が使えなくなる可能性があります。",
    [MessageKeys.welcome_title]: "Auroraにようこそ！",
    [MessageKeys.welcome_text]:
        "このソフトウェアは貴方のドリームリコールを向上させます。より良い睡眠を実現し、明晰夢を体験する可能性があがります。 良い夢を!",
    [MessageKeys.welcome_login_button]: login,
    [MessageKeys.welcome_signup_button]: signup,
    [MessageKeys.welcome_standalone_button]: "スタンドアローン",
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
    [MessageKeys.forgot_password_success]:
        "パスワードリセットのメールを送信しました。受信箱を確認してください。",
    [MessageKeys.reset_password_title]: "パスワードの再設定",
    [MessageKeys.reset_password_checking]: "リセットリンクを確認しています...",
    [MessageKeys.reset_password_invalid_link]:
        "このパスワード再設定リンクは無効か、有効期限が切れています。",
    [MessageKeys.reset_password_request_link]: "新しいリンクを請求する",
    [MessageKeys.reset_password_success]:
        "パスワードを更新しました。新しいパスワードでログインしてください。",
    [MessageKeys.reset_password_login]: "ログインへ",

    // signup fragment
    [MessageKeys.signup_title]: signup,
    [MessageKeys.signup_input_email]: input_email,
    [MessageKeys.signup_input_password]: input_password,
    [MessageKeys.signup_input_password_confirm]: input_password_confirm,
    [MessageKeys.signup_terms]: "私は利用規約を了承しました。",
    [MessageKeys.signup_newsletter]: "Auroraのニュースと最新の開発状況を取得する。",
    [MessageKeys.signup_button]: signup,

    // home fragment
    [MessageKeys.home_default_profile]: "ディフォルト プロファイル",
    [MessageKeys.home_title]: "ホーム",
    [MessageKeys.home_edit_alarm_button]: "アラームを更新",
    [MessageKeys.home_go_to_sleep_button]: "眠る",
    [MessageKeys.home_aurora_disconnected_dialog_title]: "Auroraが接続されていません。",
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
    [MessageKeys.settings_option_volume]: "アラーム音量",
    // sessions fragment
    [MessageKeys.sessions_title]: sessions,
    [MessageKeys.sessions_toolbar_button_left]: "前へ",
    [MessageKeys.sessions_toolbar_button_right]: "次へ",
    [MessageKeys.sessions_filter_by_date_label]: "日付で絞り込む",
    [MessageKeys.sessions_picker_values_any_time]: "全て",
    [MessageKeys.sessions_picker_values_past_week]: "1週間",
    [MessageKeys.sessions_picker_values_past_month]: "1ヵ月",
    [MessageKeys.sessions_check_show_starred_label]: "星付きを表示",
    [MessageKeys.sessions_check_show_starred_description]: "星付きのセッションのみ表示します。",
    [MessageKeys.sessions_check_show_notes_label]: "ノートを表示",
    [MessageKeys.sessions_check_show_notes_description]:
        "ノートを記述しているセッションのみ表示します。",

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
    [MessageKeys.session_no_sleep_data]: "睡眠データがありません",
    [MessageKeys.session_detail_filter_data]: "データを間引く",
    [MessageKeys.session_detail_show_timeline]: "タイムラインを表示",
    [MessageKeys.session_detail_show_stim_events]: "REM刺激を表示",
    [MessageKeys.session_detail_show_awakening_events]: "覚醒を表示",
    [MessageKeys.session_detail_show_button_events]: "ボタン押下を表示",
    [MessageKeys.session_export_button]: "セッションをエクスポート",
    [MessageKeys.session_export_title]: "Aurora セッションデータ",
    [MessageKeys.session_export_json]: "JSONを共有",
    [MessageKeys.session_export_csv]: "CSVを共有",
    [MessageKeys.profile_export_button]: "プロフィールをエクスポート",
    [MessageKeys.profile_export_title]: "Aurora プロフィール",
    [MessageKeys.export_failed]: "データのエクスポートに失敗しました。",
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
    [MessageKeys.sleeping_wakelock]:
        "画面はロックされています。スマートフォンのバッテリー残量に注意してください。",
    [MessageKeys.sleeping_wakeunlock]:
        "画面のロックが解除されました。OOAの機能が正常に動作しない可能性があります。このメッセージをクリックして画面を再ロックしてください。",
    [MessageKeys.sleeping_wakeup_button]: "起きる",
    [MessageKeys.sleeping_snooze_button]: "スヌーズ",
    [MessageKeys.sleeping_snoozing_message]: "9分間スヌーズ中...",
    // waking fragment
    [MessageKeys.waking_title]: "起きてください!",
    [MessageKeys.waking_wakeup_button]: "起きる",
    [MessageKeys.waking_tip_text]: "Tip: アラームを止めるためにAuroraのボタンが使えます。",
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
    [MessageKeys.passwords_must_match]: "パスワードは一致している必要があります。",
    [MessageKeys.emails_must_match]: "メールアドレスは一致している必要があります。",
    [MessageKeys.must_agree_to_term_of_use]:
        "サインアップするには利用規約に同意する必要があります。",
    [MessageKeys.email_already_registered]: "すでに入力済みのメールアドレスです。",

    // alarm sound menu
    [MessageKeys.alarm_sound_dialog_title]: "目覚まし用の音を選んでください。",

    [MessageKeys.profile_dialog_title]: "プロファイルを選んでください。",

    [MessageKeys.update_snack_bar_title]:
        "新しいバージョンが存在します。アップデートしてください。",
    [MessageKeys.update_snack_bar_action_label]: "更新",

    [MessageKeys.delete_dialog_title]: "{0}を削除しますか?",

    [MessageKeys.delete_dialog_message]: "本当に削除しても宜しいですか?　この処理は戻せません。",

    [MessageKeys.top_tab_sleep_tracking_title]: "スリープトラッキング",
    [MessageKeys.top_tab_journal_title]: "ジャーナル",
    [MessageKeys.top_tab_profile_edit_title]: "編集",
    [MessageKeys.top_tab_profile_preview_title]: "プレビュー",

    [MessageKeys.date_format]: "YYYY年MM月DD日  ",

    [MessageKeys.standalone_mode_confirm_title]: "Aurora APIへの接続に失敗しました。",

    [MessageKeys.standalone_mode_confirm_message]:
        "Aurora APIに接続できませんでした。スタンドアローンモードでオーロラを動かしますか?",

    [MessageKeys.drawer_items_main]: "メイン",
    [MessageKeys.drawer_items_sessions]: sessions,
    [MessageKeys.drawer_items_profiles]: profiles,
    [MessageKeys.drawer_items_account]: "アカウント",

    [MessageKeys.profile_rem_stim_options]: "レム睡眠誘発設定",
    [MessageKeys.profile_alarm_options]: "アラーム設定",
    [MessageKeys.profile_misc_options]: "その他設定",
    [MessageKeys.profile_filter_menu_header_label]: "プロファイルタイプで絞り込む。",
    [MessageKeys.profile_filter_menu_official_check_box_label]: "オフィシャルを見る。",
    [MessageKeys.profile_filter_menu_official_check_box_description]: "iWinks公式プロファイル",
    [MessageKeys.profile_filter_menu_community_check_box_label]: "コミュニティを見る。",
    [MessageKeys.profile_filter_menu_community_check_box_description]:
        "コミュニティ認証済みプロファイル",
    [MessageKeys.profile_filter_menu_private_check_box_label]: "プライベートを見る。",
    [MessageKeys.profile_filter_menu_private_check_box_description]:
        "貴方のプライベートプロファイル",

    [MessageKeys.profile_save_to_aurora]: "Auroraに保存",
    [MessageKeys.profile_show_advanced_options]: "詳細オプションを見る",
    [MessageKeys.connection_error]: "接続エラー",

    [MessageKeys.session_blank]: "表示するセッションを選択してください。",

    [MessageKeys.lef_effect]: "レッドエフェクト",
    [MessageKeys.effect]: "エフェクト",

    [MessageKeys.no_effect]: "効果なし",

    [MessageKeys.set]: "セット",
    [MessageKeys.blink]: "瞬き",
    [MessageKeys.alternate]: "交互",
    [MessageKeys.transition]: "遷移",

    [MessageKeys.led_effect_choose]: "LEDエフェクトを選択",
    [MessageKeys.led_effect_preview]: "エフェクトを試す",
    [MessageKeys.led_color]: "色",
    [MessageKeys.led_brightness]: "明るさ",
    [MessageKeys.led_eyes]: "発光する目",
    [MessageKeys.led_eyes_none]: "なし",
    [MessageKeys.led_eyes_both]: "両目",
    [MessageKeys.led_eyes_left]: "左",
    [MessageKeys.led_eyes_right]: "右",
    [MessageKeys.led_shutoff_delay]: "停止までの時間 (秒)",
    [MessageKeys.led_blink_count]: "点滅回数",
    [MessageKeys.led_blink_rate]: "点滅速度 (Hz)",
    [MessageKeys.led_alternate_count]: "交互回数",
    [MessageKeys.led_state1_duration]: "状態1の時間 (秒)",
    [MessageKeys.led_state2_duration]: "状態2の時間 (秒)",
    [MessageKeys.led_transition_duration]: "遷移時間 (秒)",
    [MessageKeys.led_transition_rewind]: "往復する",
    [MessageKeys.led_state1]: "状態1",
    [MessageKeys.led_state2]: "状態2",
    [MessageKeys.buzz_song_choose]: "曲を選択",
    [MessageKeys.buzz_song_none]: "曲なし",
    [MessageKeys.buzz_song_preview]: "曲を試す",
    [MessageKeys.buzz_song_repeat]: "リピート回数",
    [MessageKeys.buzz_song_volume]: "音量",
    [MessageKeys.buzz_song_tempo]: "テンポ",
    [MessageKeys.buzz_song_pitch]: "ピッチ",
    [MessageKeys.profile_hide_advanced_options]: "詳細オプションを隠す",
    [MessageKeys.profile_saved]: "プロフィールを保存しました。",
    [MessageKeys.profile_save_failed]: "プロフィールの保存に失敗しました。",
    [MessageKeys.profile_saved_to_aurora]: "Auroraに保存しました。",
    [MessageKeys.profile_save_to_aurora_failed]: "Auroraへの保存に失敗しました。",
    [MessageKeys.profile_deleted]: "プロフィールを削除しました。",
    [MessageKeys.profile_delete_failed]: "プロフィールの削除に失敗しました。",
    [MessageKeys.profile_not_connected]: "Auroraが接続されていません。",
    [MessageKeys.clear]: "クリア",

    // confirm email screen
    [MessageKeys.confirm_email_title]: "メールアドレスの確認",
    [MessageKeys.confirm_email_text]:
        "確認メールを送信しました。受信箱を確認してリンクをタップした後、下のボタンを押してください。",
    [MessageKeys.confirm_email_check_button]: "確認しました",
    [MessageKeys.confirm_email_resend_button]: "メールを再送する",
    [MessageKeys.confirm_email_change_email_button]: "メールアドレスを変更する",
    [MessageKeys.confirm_email_not_verified]:
        "まだメールアドレスが確認されていません。受信箱を確認してください。",
    [MessageKeys.confirm_email_resent]: "確認メールを再送しました。受信箱を確認してください。",

    // admin screens
    [MessageKeys.admin_title]: "管理",
    [MessageKeys.admin_users_title]: "ユーザー",
    [MessageKeys.admin_orders_title]: "注文",
    [MessageKeys.admin_sessions_title]: "セッション",
    [MessageKeys.admin_issues_title]: "問題",
    [MessageKeys.admin_messages_title]: "メッセージ",
    [MessageKeys.admin_app_settings_title]: "アプリ設定",
    [MessageKeys.drawer_items_admin]: "管理",

    // account messages
    [MessageKeys.account_messages_title]: "メッセージ",

    // account roles
    [MessageKeys.account_roles_title]: "ロール",

    // console screen
    [MessageKeys.console_title]: "コンソール",
    [MessageKeys.console_input_placeholder]: "コマンドを入力...",
    [MessageKeys.console_send_button]: "送信",
    [MessageKeys.console_clear_button]: "クリア",
    [MessageKeys.console_not_connected]:
        "Auroraが接続されていません。コンソールを使うにはAuroraに接続してください。",
    [MessageKeys.console_share_logs_button]: "ログを共有",
    [MessageKeys.console_share_logs_title]: "コンソールログ",

    // about screen
    [MessageKeys.about_title]: "アプリ情報",
    [MessageKeys.about_version_label]: "バージョン",
    [MessageKeys.about_build_label]: "ビルド",
    [MessageKeys.about_sdk_label]: "SDK",
    [MessageKeys.about_platform_label]: "プラットフォーム",
    [MessageKeys.about_os_label]: "OS",
    [MessageKeys.about_repository_label]: "リポジトリ",

    // messages screen
    [MessageKeys.messages_mark_as_read]: "既読にする",
    [MessageKeys.messages_read_label]: "既読",
    [MessageKeys.messages_unread_label]: "未読",
    [MessageKeys.messages_begin_questionnaire]: "アンケートを開始する",
    [MessageKeys.messages_continue_questionnaire]: "アンケートを続ける",
    [MessageKeys.messages_save_for_later]: "後で確認する",
    [MessageKeys.messages_already_completed]: "このアンケートはすでに完了しています。",
    [MessageKeys.messages_no_messages]: "メッセージはありません。",

    // issue report dialog
    [MessageKeys.issue_report_title]: "問題を報告する",
    [MessageKeys.issue_report_input_title]: "タイトル",
    [MessageKeys.issue_report_input_description]: "説明",
    [MessageKeys.issue_report_input_reproduce_steps]: "再現手順",
    [MessageKeys.issue_report_check_critical]: "重大な問題",
    [MessageKeys.issue_report_check_anonymous]: "匿名で送信",
    [MessageKeys.issue_report_check_attach_logs]: "ログを添付",
    [MessageKeys.issue_report_send_button]: "レポートを送信",
    [MessageKeys.issue_report_success]: "問題を報告しました。フィードバックありがとうございます！",
    [MessageKeys.issue_report_error]: "問題レポートの送信に失敗しました。",
    [MessageKeys.issue_report_button]: "問題を報告する",

    // session transfer dialog
    [MessageKeys.session_transfer_title]: "セッション転送",
    [MessageKeys.session_transfer_scanning]: "Auroraのセッションをスキャン中...",
    [MessageKeys.session_transfer_not_connected]:
        "セッションを転送するにはAuroraに接続する必要があります。",
    [MessageKeys.session_transfer_no_sessions]: "Auroraにセッションが見つかりませんでした。",
    [MessageKeys.session_transfer_transferring]: "{0}件のセッションを転送中...",
    [MessageKeys.session_transfer_complete]: "{0}件のセッションを正常に転送しました。",
    [MessageKeys.session_transfer_button]: "{0}件のセッションを転送",
    [MessageKeys.session_transfer_cancel]: "キャンセル",
    [MessageKeys.session_transfer_continue]: "続ける",
    [MessageKeys.session_transfer_delete_confirm_title]: "セッションを削除しますか?",
    [MessageKeys.session_transfer_delete_confirm_message]:
        "このセッションはまだ転送されていません。本当に削除しますか?",

    // questionnaire dialog
    [MessageKeys.questionnaire_begin_button]: "アンケートを始める",
    [MessageKeys.questionnaire_next_button]: "次へ",
    [MessageKeys.questionnaire_previous_button]: "前へ",
    [MessageKeys.questionnaire_complete_title]: "アンケート完了",
    [MessageKeys.questionnaire_close_button]: "閉じる",
    [MessageKeys.questionnaire_loading]: "アンケートを読み込み中...",
    [MessageKeys.questionnaire_error]: "アンケートの読み込みに失敗しました。",

    // change password screen
    [MessageKeys.change_password_title]: "パスワード変更",
    [MessageKeys.change_password_input_new_password]: "新しいパスワード",
    [MessageKeys.change_password_input_confirm_password]: "新しいパスワード（確認）",
    [MessageKeys.change_password_button]: "新しいパスワードを保存",
    [MessageKeys.change_password_success]: "パスワードを変更しました。",
    [MessageKeys.change_password_nav_button]: "パスワード変更",
    [MessageKeys.change_password_warning]: "パスワードを変更すると、すぐにログアウトされます。",

    // change email screen
    [MessageKeys.change_email_title]: "メールアドレス変更",
    [MessageKeys.change_email_input_new_email]: "新しいメールアドレス",
    [MessageKeys.change_email_input_confirm_email]: "新しいメールアドレス（確認）",
    [MessageKeys.change_email_button]: "新しいメールアドレスを保存",
    [MessageKeys.change_email_success]:
        "確認メールを送信しました。新しいアドレスを確認してください。",
    [MessageKeys.change_email_nav_button]: "メールアドレス変更",
    [MessageKeys.change_email_warning]:
        "メールアドレスを変更すると再認証が必要です。新しいアドレスを確認するまでログアウトしないでください。",

    // profile edit dialog
    [MessageKeys.profile_edit_title]: "プロフィール編集",
    [MessageKeys.profile_edit_input_title]: "タイトル",
    [MessageKeys.profile_edit_input_description]: "説明",
    [MessageKeys.profile_edit_button]: "保存",

    // aurora info dialog
    [MessageKeys.aurora_info_title]: "Auroraデバイス情報",
    [MessageKeys.aurora_info_firmware]: "ファームウェアバージョン",
    [MessageKeys.aurora_info_bootloader]: "ブートローダーバージョン",
    [MessageKeys.aurora_info_ble]: "BLEバージョン",
    [MessageKeys.aurora_info_bootstrap]: "ブートストラップバージョン",
    [MessageKeys.aurora_info_battery]: "バッテリーレベル",
    [MessageKeys.aurora_info_build_date]: "ビルド日時",
    [MessageKeys.aurora_info_running_time]: "稼働時間",
    [MessageKeys.aurora_info_storage]: "空き容量",
};
