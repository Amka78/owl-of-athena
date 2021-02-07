import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import {
    SettingsScreenTemplate,
    SettingsScreenTemplateProps,
} from "../../components/templates/SettingsScreenTemplate";

export default {
    title: "Templates/SettingsScreen",
    component: SettingsScreenTemplate,
} as Meta;

const Template: Story<SettingsScreenTemplateProps> = (args) => (
    <SettingsScreenTemplate {...args} />
);

export const EnUSLocale = Template.bind({});
EnUSLocale.args = {
    locale: "en-US",
    profileMenu: { hasProfiles: false, value: "" },
};

export const JaJPLocale = Template.bind({});
JaJPLocale.args = {
    locale: "ja-JP",
    profileMenu: { hasProfiles: false, value: "" },
};
