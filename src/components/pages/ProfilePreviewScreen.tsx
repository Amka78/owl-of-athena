//#region Import Modules
import React, { type FunctionComponent } from "react";

import { useProfilePreview } from "../../hooks/profiles/useProfilePreview";
import { traceRender } from "../../utils/renderTrace";
import { ProfilePreviewScreenTemplate } from "../templates/ProfilePreviewScreenTemplate";
//#endregion

//#region Component
export const ProfilePreviewScreen: FunctionComponent = () => {
    traceRender("ProfilePreviewScreen");
    const { content, onExportPress } = useProfilePreview();
    return (
        <ProfilePreviewScreenTemplate
            content={content}
            onExportPress={onExportPress}
        ></ProfilePreviewScreenTemplate>
    );
};
//#endregion
