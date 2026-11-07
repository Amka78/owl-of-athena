//#region Import Modules
import type { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";

import { Dimens, Message, MessageKeys } from "../../constants";
import { useConvertibleHeader } from "../../hooks/useConvertibleHeader";
import { useLocale } from "../../hooks/useLocale";
import type { Dimensions } from "../../hooks/useWindowDimensions";
import { AboutContent, type AboutInfoRow } from "../molecules/AboutContent";
import { ConvertibleContentTitle } from "../molecules/ConvertibleContentTitle";
import { InternalView } from "../molecules/InternalView";

//#endregion

//#region Types
export type { AboutInfoRow } from "../molecules/AboutContent";

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
                <AboutContent
                    appName={props.appName}
                    description={props.description}
                    rows={props.rows}
                    repositoryUrl={props.repositoryUrl}
                    onRepositoryPress={props.onRepositoryPress}
                />
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
});
//#endregion
