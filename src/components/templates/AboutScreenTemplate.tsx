//#region Import Modules
import React, { type FunctionComponent } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors, Dimens, Fonts, Message, MessageKeys } from "../../constants";
import { useConvertibleHeader } from "../../hooks/useConvertibleHeader";
import { useLocale } from "../../hooks/useLocale";
import type { Dimensions } from "../../hooks/useWindowDimensions";
import { ContentText } from "../atoms/ContentText";
import { ConvertibleContentTitle } from "../molecules/ConvertibleContentTitle";
import { InternalView } from "../molecules/InternalView";
//#endregion

//#region Types
export type AboutInfoRow = {
    label: string;
    value: string;
};

export type AboutScreenTemplateProps = {
    appName: string;
    description: string;
    rows: AboutInfoRow[];
    repositoryUrl: string;
    onRepositoryPress: () => void;
    dimens: Dimensions;
    locale?: string;
};
//#endregion

//#region Component
export const AboutScreenTemplate: FunctionComponent<AboutScreenTemplateProps> = (
    props: AboutScreenTemplateProps,
) => {
    useLocale(props.locale);

    useConvertibleHeader(
        MessageKeys.about_title,
        props.dimens.isDesktop,
        props.dimens.isSmallHeight,
    );

    return (
        <InternalView>
            <View style={styles.content}>
                <ConvertibleContentTitle isDesktop={props.dimens.isDesktop}>
                    {Message.get(MessageKeys.about_title)}
                </ConvertibleContentTitle>
                <ContentText style={styles.appName}>{props.appName}</ContentText>
                {props.description ? (
                    <ContentText style={styles.description}>{props.description}</ContentText>
                ) : null}
                <View style={styles.infoTable}>
                    {props.rows.map((row) => (
                        <View key={row.label} style={styles.row}>
                            <Text style={styles.label}>{row.label}</Text>
                            <Text style={styles.value}>{row.value}</Text>
                        </View>
                    ))}
                </View>
                {props.repositoryUrl ? (
                    <ContentText style={styles.link} onPress={props.onRepositoryPress}>
                        {props.repositoryUrl}
                    </ContentText>
                ) : null}
            </View>
        </InternalView>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignSelf: "stretch",
        maxWidth: Dimens.inner_screen_max_width,
        paddingTop: Dimens.content_title_margin_top,
    },
    appName: {
        flex: 0,
        fontFamily: Fonts.primarySemiBold,
        fontSize: Dimens.content_title_text_size,
        color: Colors.white,
        marginBottom: Dimens.items_margin,
    },
    description: {
        flex: 0,
        color: Colors.white,
        marginBottom: Dimens.content_title_margin_top,
    },
    infoTable: {
        marginBottom: Dimens.content_title_margin_top,
    },
    row: {
        flexDirection: "row",
        paddingVertical: Dimens.items_margin,
        borderBottomWidth: 1,
        borderBottomColor: Colors.blue,
    },
    label: {
        width: 120,
        color: Colors.first_accent_color,
        fontFamily: Fonts.primaryRegular,
        fontSize: Dimens.content_text_size,
    },
    value: {
        flex: 1,
        color: Colors.white,
        fontFamily: Fonts.primaryRegular,
        fontSize: Dimens.content_text_size,
    },
    link: {
        flex: 0,
        color: Colors.cyan,
        textDecorationLine: "underline",
    },
});
//#endregion
