import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import {
    AccountScreenTemplate,
    AccountScreenTemplateProps,
} from "../../components/templates/AccountScreenTemplate";

export default {
    title: "Templates/AccountScreen",
    component: AccountScreenTemplate,
} as Meta;

const Template: Story<AccountScreenTemplateProps> = (args) => (
    <AccountScreenTemplate {...args} />
);

export const EnUSLocale = Template.bind({});
EnUSLocale.args = {
    locale: "en-US",
};

export const JaJPLocale = Template.bind({});
JaJPLocale.args = {
    locale: "ja-JP",
};
