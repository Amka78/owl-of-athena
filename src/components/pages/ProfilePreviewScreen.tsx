//#region Import Modules
import React, { FunctionComponent } from "react";

import { useProfilePreview } from "../../hooks/profiles/useProfilePreview";
import { ProfilePreviewScreenTemplate } from "../templates/ProfilePreviewScreenTemplate";
//#endregion

//#region Component
export const ProfilePreviewScreen: FunctionComponent = () => {
    const { content } = useProfilePreview();
    return (
        <ProfilePreviewScreenTemplate
            content={content}
        ></ProfilePreviewScreenTemplate>
    );
};
//#endregion
