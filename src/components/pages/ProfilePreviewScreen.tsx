//#region Import Modules
import React, { type FunctionComponent } from "react";

import { useProfilePreview } from "../../hooks/profiles/useProfilePreview";
import { ProfilePreviewScreenTemplate } from "../templates/ProfilePreviewScreenTemplate";
//#endregion

//#region Component
export const ProfilePreviewScreen: FunctionComponent = () => {
    const { content, onExportPress } = useProfilePreview();
    return (
        <ProfilePreviewScreenTemplate
            content={content}
            onExportPress={onExportPress}
        ></ProfilePreviewScreenTemplate>
    );
};
//#endregion
