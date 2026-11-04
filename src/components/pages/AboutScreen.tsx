//#region Import Modules
import React, { type FunctionComponent } from "react";
import { Linking } from "react-native";

import { Message, MessageKeys } from "../../constants";
import { useCheckLogging } from "../../hooks/useCheckLogging";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { getAppInfo } from "../../utils";
import { AboutScreenTemplate } from "../templates/AboutScreenTemplate";
//#endregion

//#region Component
export const AboutScreen: FunctionComponent = () => {
    useCheckLogging();
    const dimens = useWindowDimensions();
    const info = getAppInfo();

    const onRepositoryPress = (): void => {
        if (!info.repositoryUrl) return;
        Linking.openURL(info.repositoryUrl).catch((error) => {
            console.debug("failed to open repository url:", error);
        });
    };

    return (
        <AboutScreenTemplate
            appName={info.name}
            description={info.description}
            rows={[
                { label: Message.get(MessageKeys.about_version_label), value: info.version },
                { label: Message.get(MessageKeys.about_build_label), value: info.build },
                { label: Message.get(MessageKeys.about_sdk_label), value: info.sdkVersion },
                { label: Message.get(MessageKeys.about_platform_label), value: info.platform },
                { label: Message.get(MessageKeys.about_os_label), value: info.osVersion },
            ]}
            repositoryUrl={info.repositoryUrl}
            onRepositoryPress={onRepositoryPress}
            dimens={dimens}
        />
    );
};
//#endregion
