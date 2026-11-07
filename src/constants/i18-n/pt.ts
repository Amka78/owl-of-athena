//#region Import Moduels
import { MessageKeys } from "../MessageKeys";

//#endregion

//#region Constant
const login = "Entrar";
const signup = "Cadastrar";
const input_email = "E-MAIL";
const input_password = "SENHA";
const input_password_confirm = "CONFIRMAR SENHA";
const session = "sessão";
const sessions = "sessões";
const profile = "perfil";
const profiles = "perfis";
const input_first_name = "PRIMEIRO NOME";
const input_last_name = "ÚLTIMO NOME";
const input_birthday = "DATA DE NASCIMENTO";
const update = "Atualizar";
//#endregion

//#region Export
export default {
    [MessageKeys.ok]: "OK",
    [MessageKeys.app_name]: "Aurora",
    [MessageKeys.save]: "SALVAR",
    [MessageKeys.save_as_new]: "Salvar Como Novo",
    [MessageKeys.overwrite_save]: "Sobrescrever",
    [MessageKeys.cancel]: "CANCELAR",
    [MessageKeys.signup]: signup,
    [MessageKeys.login]: login,
    male: "Masculino",
    [MessageKeys.female]: "Feminino",
    [MessageKeys.update]: update,
    [MessageKeys.session]: session,
    [MessageKeys.sessions]: sessions,
    [MessageKeys.profile]: profile,
    [MessageKeys.profiles]: profiles,
    [MessageKeys.long_dash]: "\u2014",
    [MessageKeys.pipe_separator]: " | ",
    [MessageKeys.reloading]: "{0} Recarregando...",
    [MessageKeys.choose]: "Escolha um(a) {0}",
    [MessageKeys.preview]: "Pré-visualizar {0}",
    [MessageKeys.offline_banner_message]:
        "Você está offline. Alguns recursos não estão disponíveis.",
    // sleep stages
    [MessageKeys.stage_awake]: "Acordado",
    [MessageKeys.stage_rem]: "REM",
    [MessageKeys.stage_light]: "Sono Leve",
    [MessageKeys.stage_deep]: "Sono Profundo",
    // form strings - uppercase since you can't style the hint/label separately
    [MessageKeys.input_first_name]: input_first_name,
    [MessageKeys.input_last_name]: input_last_name,
    [MessageKeys.input_email]: input_email,
    [MessageKeys.input_password]: input_password,
    [MessageKeys.input_password_confirm]: input_password_confirm,
    [MessageKeys.input_birthday]: input_birthday,
    // aurora strings
    [MessageKeys.aurora_connected]: "AuroraStatus:Conectado Versão:{0} Bateria:{1}%",
    [MessageKeys.aurora_disconnected]: "Aurora desconectado.",
    [MessageKeys.aurora_unsynced_sessions_dialog_title]: "Sessões não sincronizadas",
    [MessageKeys.aurora_unsynced_sessions_dialog_message]:
        "O Aurora possui {0} sessão(ões) não sincronizada(s). Sincronizar agora?",
    [MessageKeys.aurora_low_battery_dialog_title]: "Bateria do Aurora está baixa",
    [MessageKeys.aurora_low_battery_dialog_message]:
        "A bateria do Aurora está em {0}%. Para garantir que o Aurora permaneça conectado durante a noite, considere carregá-lo antes de continuar.",
    [MessageKeys.aurora_sync_successful_snackbar_message]:
        "{0} sessão(ões) sincronizada(s) com sucesso.",
    [MessageKeys.aurora_sync_successful_snackbar_action]: "Ver Agora",
    [MessageKeys.aurora_sync_mixed_message]:
        "{0} sessão(ões) sincronizada(s), porém {1} sessão(ões) falharam ao sincronizar.",
    [MessageKeys.aurora_sync_failed_message]:
        "{0} sessão(ões) apresentaram falha ao sincronizar. Tente novamente mais tarde.",
    [MessageKeys.aurora_sync_dialog_title]: "Sincronizar sessões",
    [MessageKeys.aurora_wakeup_battery_low_title]: "Bom dia!",
    [MessageKeys.aurora_wakeup_battery_low_message]:
        "A bateria do Aurora acabou, então esta sessão não pôde ser sincronizada. Ela será sincronizada na próxima vez que o app se conectar após a recarga.",
    [MessageKeys.alarm_notification_title]: "Levanta-te e brilhe!",
    [MessageKeys.alarm_notification_body]:
        "O alarme do Aurora está tocando. Use soneca ou acorde por esta notificação.",
    [MessageKeys.alarm_notification_snooze]: "Soneca",
    [MessageKeys.alarm_notification_wakeup]: "Acordar",
    [MessageKeys.firmware_update_title]: "Atualização de firmware disponível",
    [MessageKeys.firmware_update_message]:
        "O firmware {0} do Aurora está disponível. Atualizar agora? Não desligue o Aurora nem o afaste durante a atualização.",
    [MessageKeys.firmware_update_flashing]:
        "Atualizando o firmware. Não desligue o Aurora nem feche o app.",
    [MessageKeys.firmware_update_success]: "Firmware atualizado para {0}.",
    [MessageKeys.firmware_update_failed]: "Falha na atualização do firmware: {0}",
    [MessageKeys.firmware_update_battery_low]:
        "Carregue o Aurora antes de atualizar o firmware. Atualizar com a bateria fraca pode deixar o dispositivo inutilizável.",
    [MessageKeys.firmware_update_unsynced_warning]:
        "{0} sessão(ões) não sincronizada(s) serão perdidas se você atualizar. Transfira-as primeiro.",
    [MessageKeys.firmware_component_app]: "Firmware do aplicativo",
    [MessageKeys.firmware_component_bootloader]: "Bootloader",
    [MessageKeys.firmware_component_ble]: "Firmware BLE",
    [MessageKeys.firmware_update_message_with_component]:
        "{0} {1} está disponível. Atualizar agora? Não desligue nem mova o Aurora durante a atualização.",
    [MessageKeys.firmware_update_flashing_with_component]:
        "Gravando {0}... Não desligue o Aurora nem feche o aplicativo.",
    [MessageKeys.firmware_update_downloading_with_component]: "Baixando {0}...",
    [MessageKeys.firmware_update_uploading_with_component]: "Enviando {0} para o Aurora...",
    [MessageKeys.firmware_update_verifying_with_component]: "Verificando {0}...",
    [MessageKeys.firmware_update_success_with_component]: "{0} atualizado para {1}.",
    [MessageKeys.firmware_update_failed_with_component]: "Falha ao atualizar {0}: {1}",
    [MessageKeys.firmware_update_failed_hint]:
        "Reinicie o Aurora com o botão de reset, reconecte e tente novamente.",
    // welcome fragment
    [MessageKeys.welcome_title]: "Bem vindo ao Aurora!",
    [MessageKeys.welcome_text]:
        "O software avançado do Aurora vai ajudar você a melhorar a lembrança dos seus sonhos, ter um sono mais profundo e acelerar sua jornada para alcançar todo o seu potencial. Bons sonhos!",
    [MessageKeys.welcome_login_button]: login,
    [MessageKeys.welcome_signup_button]: signup,
    [MessageKeys.welcome_standalone_button]: "StandAlone",
    // login fragment
    [MessageKeys.login_title]: login,
    [MessageKeys.login_input_email]: input_email,
    [MessageKeys.login_input_password]: input_password,
    [MessageKeys.login_forgot_password_button]: "Esqueceu sua senha?",
    [MessageKeys.login_no_account_button]: "Ainda não tem uma conta?",
    [MessageKeys.login_button]: login,
    [MessageKeys.login_loading_message]: "Entrando...",
    [MessageKeys.login_general_error_message]: "Falha ao entrar. E-mail ou senha inválidos.",

    // forgot-password fragment
    [MessageKeys.forgot_password_title]: "Esqueceu sua senha?",
    [MessageKeys.forgot_password_text]:
        "Dificuldades em lembrar sua senha? Informe seu endereço de e-mail abaixo e enviaremos as instruções para redefini-la.",
    [MessageKeys.forgot_password_input_email]: input_email,
    [MessageKeys.forgot_password_button]: "Solicitar Redefinição",
    [MessageKeys.forgot_password_success]:
        "E-mail de redefinição enviado. Por favor verifique sua caixa de entrada.",
    [MessageKeys.reset_password_title]: "Redefinir Senha",
    [MessageKeys.reset_password_checking]: "Verificando o link de redefinição...",
    [MessageKeys.reset_password_invalid_link]: "Este link de redefinição é inválido ou expirou.",
    [MessageKeys.reset_password_request_link]: "Solicitar Novo Link",
    [MessageKeys.reset_password_success]: "Sua senha foi atualizada. Entre com a nova senha.",
    [MessageKeys.reset_password_login]: "Ir para o Login",
    [MessageKeys.signup_title]: signup,
    [MessageKeys.signup_input_email]: input_email,
    [MessageKeys.signup_input_password]: input_password,
    [MessageKeys.signup_input_password_confirm]: input_password_confirm,
    [MessageKeys.signup_terms]: "Concordo com os termos de uso",
    [MessageKeys.signup_newsletter]: "Mantenha-me informado sobre novidades do Aurora",
    [MessageKeys.signup_button]: signup,

    // home fragment
    [MessageKeys.home_default_profile]: "Perfil Padrão",
    [MessageKeys.home_title]: "Início",
    [MessageKeys.home_edit_alarm_button]: "Ajustar Alarme",
    [MessageKeys.home_go_to_sleep_button]: "Ir Para a Cama",
    [MessageKeys.home_aurora_disconnected_dialog_title]: "Aurora não conectado",
    [MessageKeys.home_aurora_disconnected_dialog_message]:
        "Para conectar, desligue o Aurora se ele estiver ligado e depois ligue-o novamente.",
    [MessageKeys.home_go_to_sleep_loading_message]: "Configurando o Aurora...",
    [MessageKeys.home_go_to_sleep_error_message]:
        "Falha ao configurar o Aurora. Reinicie a unidade e tente novamente.",

    // settings fragment
    [MessageKeys.settings_title]: "Ajustar Alarme",
    [MessageKeys.settings_option_profile]: "Perfil",
    [MessageKeys.settings_option_smart_alarm]: "Alarme Inteligente",
    [MessageKeys.settings_option_rem_stim]: "Estímulos REM",
    [MessageKeys.settings_option_dsl]: "Simular Luz do Amanhecer",
    [MessageKeys.settings_option_alarm_audio]: "Toque do Alarme",
    [MessageKeys.settings_option_rem_stim_audio]: "Toque dos Estímulos REM",
    [MessageKeys.settings_option_no_audio_selected]: "Nenhum",
    [MessageKeys.settings_option_volume]: "Volume do Alarme",
    // sessions fragment
    [MessageKeys.sessions_title]: sessions,
    [MessageKeys.sessions_toolbar_button_left]: "Anterior",
    [MessageKeys.sessions_toolbar_button_right]: "Próximo",
    [MessageKeys.sessions_filter_by_date_label]: "Filtrar por Data",
    [MessageKeys.sessions_picker_values_any_time]: "Qualquer Data",
    [MessageKeys.sessions_picker_values_past_week]: "Última Semana",
    [MessageKeys.sessions_picker_values_past_month]: "Último Mês",
    [MessageKeys.sessions_check_show_starred_label]: "Mostrar Favoritas",
    [MessageKeys.sessions_check_show_starred_description]: "Somente sessões favoritas",
    [MessageKeys.sessions_check_show_notes_label]: "Mostrar Notas",
    [MessageKeys.sessions_check_show_notes_description]: "Somente sessões com notas",
    [MessageKeys.session_list_new]: "NOVO",
    [MessageKeys.session_list_month_format]: "MM/YYYY",
    // session fragment
    [MessageKeys.session_asleep_time_label]: "adormeceu às",
    [MessageKeys.session_awake_time_label]: "acordou às",
    [MessageKeys.session_sleep_score_label]: "nota do sono",
    [MessageKeys.session_sleep_duration_label]: "tempo de sono",
    [MessageKeys.session_rem_duration_label]: "tempo REM",
    [MessageKeys.session_deep_duration_label]: "tempo profundo",
    [MessageKeys.session_movement_label]: "Movimento",
    [MessageKeys.session_notes_label]: "Notas",
    [MessageKeys.session_notes_hint_text]: "toque para adicionar uma nota",
    [MessageKeys.session_no_sleep_data]: "Nenhum dado de sono disponível",
    [MessageKeys.session_detail_filter_data]: "Filtrar Dados",
    [MessageKeys.session_detail_show_timeline]: "Mostrar Linha do Tempo",
    [MessageKeys.session_detail_show_stim_events]: "Mostrar Estímulos REM",
    [MessageKeys.session_detail_show_awakening_events]: "Mostrar Despertares",
    [MessageKeys.session_detail_show_button_events]: "Mostrar Pressões de Botão",
    [MessageKeys.session_export_button]: "Exportar Sessão",
    [MessageKeys.session_export_title]: "Dados da Sessão Aurora",
    [MessageKeys.session_export_json]: "Compartilhar JSON",
    [MessageKeys.session_export_csv]: "Compartilhar CSV",
    [MessageKeys.download_zip]: "Baixar ZIP",
    [MessageKeys.profile_export_button]: "Exportar Perfil",
    [MessageKeys.profile_export_title]: "Perfil Aurora",
    [MessageKeys.export_failed]: "Falha ao exportar os dados.",
    [MessageKeys.session_light_pie_chart_label]: "Leve - {0}",
    [MessageKeys.session_deep_pie_chart_label]: "Profundo - {0}",
    [MessageKeys.session_rem_pie_chart_label]: "REM - {0}",
    [MessageKeys.session_awake_pie_chart_label]: "Acordado - {0}",
    [MessageKeys.session_no_signal_pie_chart_label]: "Sem Sinal - {0}",
    // account fragment
    [MessageKeys.account_title]: "Conta",
    [MessageKeys.account_input_first_name]: input_first_name,
    [MessageKeys.account_input_last_name]: input_last_name,
    [MessageKeys.account_input_birthday]: input_birthday,
    [MessageKeys.account_input_country_code]: "Código do país (ex.: BR)",
    [MessageKeys.account_input_postal_code]: "CEP / código postal",
    [MessageKeys.account_button]: update,
    [MessageKeys.account_signout]: "Sair",
    [MessageKeys.account_loading_message]: "Salvando...",
    [MessageKeys.account_success_message]: "Conta salva com sucesso.",
    // sleeping fragment
    [MessageKeys.sleeping_title]: "Bons sonhos...",
    [MessageKeys.sleeping_wakelock]:
        "A tela está bloqueada. Por favor, fique atento à bateria do seu celular.",
    [MessageKeys.sleeping_wakeunlock]:
        "A tela foi desbloqueada, o funcionamento do OOA pode não ser correto. Toque nesta mensagem para bloquear a tela novamente.",
    [MessageKeys.sleeping_wakeup_button]: "Acordar",
    [MessageKeys.sleeping_snooze_button]: "Soneca",
    [MessageKeys.sleeping_snoozing_message]: "Soneca por 9 minutos...",
    // waking fragment
    [MessageKeys.waking_title]: "Hora de acordar!",
    [MessageKeys.waking_wakeup_button]: "Acordar",
    [MessageKeys.waking_tip_text]: "Dica: você pode usar o botão do Aurora para parar o alarme.",
    // awake fragment
    [MessageKeys.awake_title]: "Bom Dia!",
    [MessageKeys.awake_text]: "Por favor responda algumas perguntas sobre o sono da noite passada.",
    [MessageKeys.awake_questionnaire_continue_button]: "Continuar",
    [MessageKeys.awake_questionnaire_skip_button]: "Pular",
    [MessageKeys.wip_dialog_title]: "Em Desenvolvimento",
    [MessageKeys.wip_dialog_message]: "Ops, este recurso ainda não está pronto para uso.",
    [MessageKeys.account_not_activated]: "Conta não ativada.",

    // error required
    [MessageKeys.required]: "O campo {0} é obrigatório.",
    [MessageKeys.passwords_must_match]: "As senhas devem coincidir.",
    [MessageKeys.emails_must_match]: "Os endereços de e-mail devem coincidir.",
    [MessageKeys.must_agree_to_term_of_use]:
        "Você deve concordar com os termos de uso para continuar.",
    [MessageKeys.email_already_registered]: "Este e-mail já foi registrado.",

    // alarm sound menu
    [MessageKeys.alarm_sound_dialog_title]: "Escolha um toque",

    // profile menu
    [MessageKeys.profile_dialog_title]: "Escolha um perfil",

    [MessageKeys.update_snack_bar_title]: "Há uma nova versão. Por favor atualize.",

    [MessageKeys.update_snack_bar_action_label]: "Atualizar",

    [MessageKeys.delete_dialog_title]: "Excluir Sessão?",

    [MessageKeys.delete_dialog_message]:
        "Tem certeza de que deseja excluir esta sessão? Esta ação não pode ser desfeita.",

    [MessageKeys.top_tab_sleep_tracking_title]: "MONITORAMENTO DO SONO",
    [MessageKeys.top_tab_journal_title]: "DIÁRIO",
    [MessageKeys.top_tab_profile_edit_title]: "EDITAR",
    [MessageKeys.top_tab_profile_preview_title]: "VISUALIZAR",

    [MessageKeys.date_format]: "DD,MM,YYYY",

    [MessageKeys.standalone_mode_confirm_title]: "Falha na conexão com a API do Aurora.",

    [MessageKeys.standalone_mode_confirm_message]:
        "Não foi possível conectar à API do Aurora. Deseja executar o Aurora no modo standalone?",
    [MessageKeys.drawer_items_main]: "Início",
    [MessageKeys.drawer_items_sessions]: sessions,
    [MessageKeys.drawer_items_profiles]: profiles,
    [MessageKeys.drawer_items_account]: "Conta",

    [MessageKeys.profile_rem_stim_options]: "Opções dos Estímulos REM",
    [MessageKeys.profile_alarm_options]: "Opções do Alarme",
    [MessageKeys.profile_misc_options]: "Outras Opções",
    [MessageKeys.profile_filter_menu_header_label]: "Filtrar por Tipo de Perfil",
    [MessageKeys.profile_filter_menu_official_check_box_label]: "Mostrar Oficiais",
    [MessageKeys.profile_filter_menu_official_check_box_description]: "Perfis oficiais da iWinks.",
    [MessageKeys.profile_filter_menu_community_check_box_label]: "Mostrar da Comunidade",
    [MessageKeys.profile_filter_menu_community_check_box_description]:
        "Perfis enviados pela comunidade.",
    [MessageKeys.profile_filter_menu_private_check_box_label]: "Mostrar Privados",
    [MessageKeys.profile_filter_menu_private_check_box_description]: "Seus perfis privados.",

    [MessageKeys.profile_save_to_aurora]: "Salvar no Aurora",
    [MessageKeys.profile_show_advanced_options]: "Mostrar Opções Avançadas",
    [MessageKeys.connection_error]: "Erro de Conexão",

    [MessageKeys.session_blank]: "Por favor selecione as sessões que deseja visualizar.",

    [MessageKeys.lef_effect]: "Efeito de LED",
    [MessageKeys.effect]: "Efeito",
    [MessageKeys.no_effect]: "Sem Efeito",

    [MessageKeys.set]: "Fixo",
    [MessageKeys.blink]: "Piscar",
    [MessageKeys.alternate]: "Alternar",
    [MessageKeys.transition]: "Transição",

    [MessageKeys.led_effect_choose]: "Escolher Efeito de LED",
    [MessageKeys.led_effect_preview]: "Testar Efeito",
    [MessageKeys.led_color]: "Cor",
    [MessageKeys.led_brightness]: "Brilho",
    [MessageKeys.led_eyes]: "Olhos",
    [MessageKeys.led_eyes_none]: "Nenhum",
    [MessageKeys.led_eyes_both]: "Ambos",
    [MessageKeys.led_eyes_left]: "Esquerdo",
    [MessageKeys.led_eyes_right]: "Direito",
    [MessageKeys.led_shutoff_delay]: "Tempo até desligar (s)",
    [MessageKeys.led_blink_count]: "Vezes para piscar",
    [MessageKeys.led_blink_rate]: "Velocidade do piscar (Hz)",
    [MessageKeys.led_alternate_count]: "Vezes para alternar",
    [MessageKeys.led_state1_duration]: "Duração do Estado 1 (s)",
    [MessageKeys.led_state2_duration]: "Duração do Estado 2 (s)",
    [MessageKeys.led_transition_duration]: "Duração da Transição (s)",
    [MessageKeys.led_transition_rewind]: "Reverter Transição",
    [MessageKeys.led_state1]: "Estado 1",
    [MessageKeys.led_state2]: "Estado 2",
    [MessageKeys.buzz_song_choose]: "Escolher Música",
    [MessageKeys.buzz_song_none]: "Sem Música",
    [MessageKeys.buzz_song_preview]: "Testar Música",
    [MessageKeys.buzz_song_repeat]: "Repetições",
    [MessageKeys.buzz_song_volume]: "Volume",
    [MessageKeys.buzz_song_tempo]: "Tempo",
    [MessageKeys.buzz_song_pitch]: "Tom",
    [MessageKeys.profile_hide_advanced_options]: "Ocultar Opções Avançadas",
    [MessageKeys.profile_saved]: "Perfil salvo.",
    [MessageKeys.profile_save_failed]: "Falha ao salvar o perfil.",
    [MessageKeys.profile_saved_to_aurora]: "Perfil salvo no Aurora.",
    [MessageKeys.profile_save_to_aurora_failed]: "Falha ao salvar o perfil no Aurora.",
    [MessageKeys.profile_deleted]: "Perfil excluído.",
    [MessageKeys.profile_delete_failed]: "Falha ao excluir o perfil.",
    [MessageKeys.profile_not_connected]: "O Aurora não está conectado.",
    [MessageKeys.clear]: "Limpar",

    // confirm email screen
    [MessageKeys.confirm_email_title]: "Confirme seu E-mail",
    [MessageKeys.confirm_email_text]:
        "Enviamos um e-mail de confirmação para o seu endereço. Verifique sua caixa de entrada, toque no link e depois pressione o botão abaixo.",
    [MessageKeys.confirm_email_check_button]: "Já Confirmei Meu E-mail",
    [MessageKeys.confirm_email_resend_button]: "Reenviar E-mail",
    [MessageKeys.confirm_email_change_email_button]: "Alterar E-mail",
    [MessageKeys.confirm_email_not_verified]:
        "Seu e-mail ainda não foi confirmado. Por favor verifique sua caixa de entrada.",
    [MessageKeys.confirm_email_resent]:
        "E-mail de confirmação reenviado. Por favor verifique sua caixa de entrada.",

    // admin screens
    [MessageKeys.admin_title]: "Admin",
    [MessageKeys.admin_users_title]: "Usuários",
    [MessageKeys.admin_orders_title]: "Pedidos",
    [MessageKeys.admin_sessions_title]: sessions,
    [MessageKeys.admin_issues_title]: "Problemas",
    [MessageKeys.admin_messages_title]: "Mensagens",
    [MessageKeys.admin_app_settings_title]: "Ajustes do App",
    [MessageKeys.admin_export_csv_button]: "Compartilhar CSV",
    [MessageKeys.admin_columns_button]: "Colunas",
    [MessageKeys.admin_selected_count]: "{0} selecionados",
    [MessageKeys.admin_selection_clear]: "Limpar",
    [MessageKeys.admin_issue_logs_title]: "Registros",
    [MessageKeys.admin_issue_logs_open_hint]: "Toque para ver os detalhes",
    [MessageKeys.admin_issue_attachments_title]: "Anexos",
    [MessageKeys.drawer_items_admin]: "Admin",

    // account messages
    [MessageKeys.account_messages_title]: "Mensagens",

    // account roles
    [MessageKeys.account_roles_title]: "Funções",

    // console screen
    [MessageKeys.console_title]: "Console",
    [MessageKeys.console_input_placeholder]: "Digite o comando...",
    [MessageKeys.console_send_button]: "Enviar",
    [MessageKeys.console_clear_button]: "Limpar",
    [MessageKeys.console_not_connected]:
        "O Aurora não está conectado. Conecte o Aurora para usar o console.",
    [MessageKeys.console_share_logs_button]: "Compartilhar logs",
    [MessageKeys.console_share_logs_title]: "Logs do console",

    // about screen
    [MessageKeys.about_title]: "Sobre",
    [MessageKeys.about_version_label]: "Versão",
    [MessageKeys.about_build_label]: "Build",
    [MessageKeys.about_sdk_label]: "SDK",
    [MessageKeys.about_platform_label]: "Plataforma",
    [MessageKeys.about_os_label]: "SO",
    [MessageKeys.about_repository_label]: "Repositório",

    // device maintenance
    [MessageKeys.device_section_title]: "Dispositivo Aurora",
    [MessageKeys.device_sd_format_button]: "Formatar cartão SD",
    [MessageKeys.device_reset_button]: "Redefinir Aurora",
    [MessageKeys.device_sd_format_confirm_title]: "Formatar o cartão SD?",
    [MessageKeys.device_sd_format_confirm_message]:
        "Todas as sessões no Aurora serão excluídas. Transfira as sessões não sincronizadas primeiro.",
    [MessageKeys.device_reset_confirm_title]: "Redefinir o Aurora?",
    [MessageKeys.device_reset_confirm_message]:
        "As configurações e os dados armazenados no Aurora serão redefinidos e o dispositivo reiniciará.",
    [MessageKeys.device_sd_format_in_progress]: "Formatando o cartão SD...",
    [MessageKeys.device_reset_in_progress]: "Redefinindo o Aurora...",
    [MessageKeys.device_operation_complete_title]: "Concluído",
    [MessageKeys.device_sd_format_success]: "O cartão SD foi formatado.",
    [MessageKeys.device_reset_success]: "O Aurora foi redefinido. Reconecte após reiniciar.",
    [MessageKeys.device_operation_failed_title]: "Falha na operação",
    [MessageKeys.device_operation_failed_message]: "Falha na operação: {0}",
    [MessageKeys.device_not_connected]: "Conecte-se ao Aurora para usar.",

    // messages screen
    [MessageKeys.messages_mark_as_read]: "Marcar como Lida",
    [MessageKeys.messages_read_label]: "Lida",
    [MessageKeys.messages_unread_label]: "Não Lida",
    [MessageKeys.messages_mark_all_read]: "Marcar todas como lidas",
    [MessageKeys.messages_begin_questionnaire]: "Iniciar Questionário",
    [MessageKeys.messages_continue_questionnaire]: "Continuar Questionário",
    [MessageKeys.messages_save_for_later]: "Salvar para Depois",
    [MessageKeys.messages_already_completed]: "Você já respondeu este questionário.",
    [MessageKeys.messages_no_messages]: "Nenhuma mensagem.",

    // issue report dialog
    [MessageKeys.issue_report_title]: "Reportar um Problema",
    [MessageKeys.issue_report_input_title]: "TÍTULO",
    [MessageKeys.issue_report_input_description]: "DESCRIÇÃO",
    [MessageKeys.issue_report_input_reproduce_steps]: "PASSOS PARA REPRODUZIR",
    [MessageKeys.issue_report_check_critical]: "Problema crítico",
    [MessageKeys.issue_report_check_anonymous]: "Enviar anonimamente",
    [MessageKeys.issue_report_check_attach_logs]: "Anexar logs",
    [MessageKeys.issue_report_attach_image]: "Anexar captura de tela / imagem",
    [MessageKeys.issue_report_attach_file]: "Anexar arquivo",
    [MessageKeys.issue_report_attachments]: "Anexos",
    [MessageKeys.issue_report_attachment_too_large]: "Cada anexo deve ter no máximo 10 MB.",
    [MessageKeys.issue_report_attachment_limit]: "É possível anexar até 5 arquivos.",
    [MessageKeys.issue_report_media_permission_error]:
        "O acesso à biblioteca de fotos não foi permitido.",
    [MessageKeys.issue_report_remove_attachment]: "Remover anexo",
    [MessageKeys.issue_report_send_button]: "Enviar Relatório",
    [MessageKeys.issue_report_success]: "Problema reportado. Obrigado pelo seu retorno!",
    [MessageKeys.issue_report_error]: "Falha ao enviar o relatório do problema.",
    [MessageKeys.issue_report_button]: "Reportar um Problema",

    // session transfer dialog
    [MessageKeys.session_transfer_title]: "Transferência de Sessões",
    [MessageKeys.session_transfer_scanning]: "Procurando sessões no Aurora...",
    [MessageKeys.session_transfer_not_connected]:
        "Você precisa estar conectado ao Aurora para transferir sessões.",
    [MessageKeys.session_transfer_no_sessions]: "Nenhuma sessão encontrada no Aurora.",
    [MessageKeys.session_transfer_transferring]: "Transferindo {0} sessão(ões)...",
    [MessageKeys.session_transfer_reading]: "Lendo {0} / {1} sessões...",
    [MessageKeys.session_transfer_uploading]: "Transferindo {0} / {1} sessões...",
    [MessageKeys.session_transfer_complete]: "{0} sessão(ões) transferida(s) com sucesso.",
    [MessageKeys.session_transfer_button]: "Transferir {0} Sessão(ões)",
    [MessageKeys.session_transfer_cancel]: "Cancelar",
    [MessageKeys.session_transfer_continue]: "Continuar",
    [MessageKeys.session_transfer_delete_confirm_title]: "Excluir Sessão?",
    [MessageKeys.session_transfer_delete_confirm_message]:
        "Esta sessão não foi transferida. Tem certeza de que deseja excluí-la?",

    // questionnaire dialog
    [MessageKeys.questionnaire_begin_button]: "Iniciar Questionário",
    [MessageKeys.questionnaire_next_button]: "Próxima",
    [MessageKeys.questionnaire_previous_button]: "Anterior",
    [MessageKeys.questionnaire_complete_title]: "Questionário Concluído",
    [MessageKeys.questionnaire_close_button]: "Fechar",
    [MessageKeys.questionnaire_loading]: "Carregando questionário...",
    [MessageKeys.questionnaire_error]: "Falha ao carregar o questionário.",
    [MessageKeys.questionnaire_text_placeholder]: "Digite sua resposta",

    // change password screen
    [MessageKeys.change_password_title]: "Alterar Senha",
    [MessageKeys.change_password_input_new_password]: "NOVA SENHA",
    [MessageKeys.change_password_input_confirm_password]: "CONFIRMAR NOVA SENHA",
    [MessageKeys.change_password_button]: "Salvar Nova Senha",
    [MessageKeys.change_password_success]: "Senha alterada com sucesso.",
    [MessageKeys.change_password_nav_button]: "Alterar Senha",
    [MessageKeys.change_password_warning]: "Alterar sua senha encerrará sua sessão imediatamente.",

    // change email screen
    [MessageKeys.change_email_title]: "Alterar E-mail",
    [MessageKeys.change_email_input_new_email]: "NOVO E-MAIL",
    [MessageKeys.change_email_input_confirm_email]: "CONFIRMAR NOVO E-MAIL",
    [MessageKeys.change_email_button]: "Salvar Novo E-mail",
    [MessageKeys.change_email_success]:
        "E-mail de confirmação enviado. Verifique sua caixa de entrada para validar seu novo endereço.",
    [MessageKeys.change_email_nav_button]: "Alterar E-mail",
    [MessageKeys.change_email_warning]:
        "Alterar seu e-mail exigirá uma nova ativação. Não saia da conta até confirmar o novo endereço.",

    // profile edit dialog
    [MessageKeys.profile_edit_title]: "Editar Perfil",
    [MessageKeys.profile_edit_input_title]: "TÍTULO",
    [MessageKeys.profile_edit_input_description]: "DESCRIÇÃO",
    [MessageKeys.profile_edit_button]: "Salvar Perfil",

    // aurora info dialog
    [MessageKeys.aurora_info_title]: "Informações do Aurora",
    [MessageKeys.aurora_info_firmware]: "Versão do Firmware",
    [MessageKeys.aurora_info_bootloader]: "Versão do Bootloader",
    [MessageKeys.aurora_info_ble]: "Versão do BLE",
    [MessageKeys.aurora_info_bootstrap]: "Versão do Bootstrap",
    [MessageKeys.aurora_info_battery]: "Nível da Bateria",
    [MessageKeys.aurora_info_build_date]: "Data de Build",
    [MessageKeys.aurora_info_running_time]: "Tempo de Atividade",
    [MessageKeys.aurora_info_storage]: "Armazenamento Livre",
};
//#endregion
