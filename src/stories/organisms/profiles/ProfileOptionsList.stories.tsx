//#region Import Modules
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";

import {
    ProfileOptionList,
    ProfileOptionListProps,
} from "../../../components/organisms/profiles/ProfileOptionList";
import {
    defaultOptions,
    groupingProfileOptionList,
} from "../../../services/ProfileService";
//#endregion

//#region Story
export default {
    title: "Organisms/ProfileOptionList",
    component: ProfileOptionList,
} as Meta;

const groupedOptionList = groupingProfileOptionList(defaultOptions);

const Template: Story<ProfileOptionListProps> = (args) => (
    <ProfileOptionList {...args} />
);

export const EnUSLocale = Template.bind({});
EnUSLocale.args = {
    locale: "en-US",
    groupedOptionList,
};

export const JaJPLocale = Template.bind({});
JaJPLocale.args = {
    locale: "ja-JP",
    groupedOptionList,
};
//#endregion
