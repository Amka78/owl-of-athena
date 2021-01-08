import Layout from "./Layout";

const session_margin_left = 30;
const session_margin_right = 30;

export default {
    toolbar_title_text_size: 14,
    toolbar_button_text_size: 14,
    toolbar_button_margin_horizontal: 8,

    view_padding_bottom: 12,

    content_title_text_size: 24,
    content_title_margin_top: 32,
    content_title_margin_bottom: 48,
    content_text_size: 16,
    content_margin_horizontal: 48,

    snackbar_text_size: 8,

    statusbar_height: 8,

    navbar_height: 64,

    tip_text_size: 13,
    tip_text_margin_bottom: 13,

    error_text_size: 13,
    error_text_margin_bottom: 18,

    button_text_size: 24,
    button_height: 50,
    button_margin_bottom: 16,
    button_radius: 16,
    button_flat_text_size: 14,
    button_flat_margin_bottom: 12,
    button_flat_height: 28,

    input_text_size: 12,
    input_margin_bottom: 16,

    checkbox_text_size: 12,
    checkbox_outer_diameter: 24,
    checkbox_inner_diameter: 16,
    checkbox_gap: 4,
    checkbox_offset: 2,
    checkbox_padding_left: 16,
    checkbox_padding_right: 24,
    checkbox_margin_top: 16,
    checkbox_margin_bottom: 8,

    option_text_size: 14,
    option_height: 20,
    option_margin_bottom: 12,

    time_picker_height: 150,
    time_picker_scale: 1,
    time_picker_padding_horizontal: 0,

    circular_progress_diameter: 96,
    circular_progress_text_size: 32,

    // home fragment dimensions
    home_alarm_time_text_size: 48,
    home_alarm_meridian_text_size: 22,

    // session fragment dimensions
    session_label_text_size: 20,
    session_sleep_score_text_size: 48,
    session_notes_text_size: 20,
    session_margin_left: session_margin_left,
    session_margin_right: session_margin_right,
    session_chart_width:
        Layout.window.fixedWidth - (session_margin_left + session_margin_right),
    session_radial_progress_chart_width: Layout.isSmallDevice ? 45 : 90,
    session_radial_progress_chart_height: Layout.isSmallDevice ? 45 : 90,
    session_radial_progress_chart_font_size: Layout.isSmallDevice ? 25 : 50,
    session_time_text_size: Layout.isSmallDevice ? 15 : 30,
    session_alarm_meridian_text_size: Layout.isSmallDevice ? 11 : 22,
    session_percent_label_size: Layout.isWidthSmallDevice ? 6 : 15,
    session_category_label_size: Layout.isSmallDevice ? 10 : 20,
    session_chart_pie_outer_radius: Layout.isSmallDevice ? 63 : 146,
    session_chart_pie_inner_radius: Layout.isSmallDevice ? 40 : 80,
    session_chart_pie_category_label_padding: Layout.isSmallDevice ? 18 : 36,

    // session list fragment dimensions
    session_list_item_padding: 12,

    session_list_section_height: 24,
    session_list_section_padding_left: 24,
    session_list_section_text_size: 16,

    session_list_item_title_text_size: 20,
    session_list_item_subtitle_text_size: 15,
    session_list_item_text_margin_left: 18
};
