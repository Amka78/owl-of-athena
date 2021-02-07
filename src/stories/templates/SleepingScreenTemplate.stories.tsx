import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import {
    SleepingScreenTemplate,
    SleepingScreenTemplateProps,
} from "../../components/templates/SleepingScreenTemplate";

export default {
    title: "Templates/SleepingScreen",
    component: SleepingScreenTemplate,
} as Meta;

const Template: Story<SleepingScreenTemplateProps> = (args) => (
    <SleepingScreenTemplate {...args} />
);

export const EnUSLocale = Template.bind({});
EnUSLocale.args = {
    locale: "en-US",
};

export const JaJPLocale = Template.bind({});
JaJPLocale.args = {
    locale: "ja-JP",
};
