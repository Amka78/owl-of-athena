import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import {
    WakingScreenTemplate,
    WakingScreenTemplateProps,
} from "../../components/templates/WakingScreenTemplate";

export default {
    title: "Templates/WakingScreen",
    component: WakingScreenTemplate,
} as Meta;

const Template: Story<WakingScreenTemplateProps> = (args) => (
    <WakingScreenTemplate {...args} />
);

export const EnUSLocale = Template.bind({});
EnUSLocale.args = {
    locale: "en-US",
};

export const JaJPLocale = Template.bind({});
JaJPLocale.args = {
    locale: "ja-JP",
};
