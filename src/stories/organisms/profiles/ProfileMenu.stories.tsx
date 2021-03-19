//#region Import Modules
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
    ProfileMenu,
    ProfileMenuProps,
} from "../../../components/organisms/profiles/ProfileMenu";
//#endregion

//#region Story
export default {
    title: "Organisms/UnsavedProfileMenu",
    component: ProfileMenu,
} as Meta;

const Template: Story<ProfileMenuProps> = (args) => <ProfileMenu {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    selectedProfile: {
        content: "",
        id: "",
        key: "",
        name: "test",
        title: "test",
        starred: false,
        type: "community",
    },
};
//#endregion
