import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import {
    SessionScreenTemplate,
    SessionScreenTemplateProps,
} from "../../components/templates/SessionScreenTemplate";

export default {
    title: "Templates/SessionScreen",
    component: SessionScreenTemplate,
} as Meta;

const Template: Story<SessionScreenTemplateProps> = (args) => (
    <SessionScreenTemplate {...args} />
);

export const EnUSLocale = Template.bind({});
EnUSLocale.args = {
    locale: "en-US",
};

export const JaJPLocale = Template.bind({});
JaJPLocale.args = {
    locale: "ja-JP",
};
