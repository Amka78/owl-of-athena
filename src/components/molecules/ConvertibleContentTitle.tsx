//#region Import Modules
import React, { FunctionComponent } from "react";

import { ContentTitle, ContentTitleProps } from "../atoms/ContentTitle";
//#endregion

//#region Types
export type ConvertibleContentTitleProps = ContentTitleProps & {
    isDesktop: boolean;
};
//#endregion

//#region Component
export const ConvertibleContentTitle: FunctionComponent<ConvertibleContentTitleProps> = (
    props: ConvertibleContentTitleProps
) => {
    const contentTitle = props.isDesktop ? (
        <ContentTitle {...props}></ContentTitle>
    ) : null;
    return contentTitle;
};
//#endregion
