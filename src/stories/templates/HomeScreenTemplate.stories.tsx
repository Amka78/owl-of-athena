import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import {
    HomeScreenTemplate,
    HomeScreenTemplateProps,
} from "../../components/templates/HomeScreenTemplate";

export default {
    title: "Templates/HomeScreen",
    component: HomeScreenTemplate,
} as Meta;

const Template: Story<HomeScreenTemplateProps> = (args) => (
    <HomeScreenTemplate {...args} />
);

export const EnUSLocale = Template.bind({});
EnUSLocale.args = {
    locale: "en-US",
};

export const JaJPLocale = Template.bind({});
JaJPLocale.args = {
    locale: "ja-JP",
};
