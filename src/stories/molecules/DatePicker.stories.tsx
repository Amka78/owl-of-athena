import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import { DatePicker } from "../../components/molecules/DatePicker";
import { DatePickerProps } from "../../components/molecules/DatePickerProps";
export default {
    title: "Molecules/DatePicker",
    component: DatePicker,
    argTypes: {
        backgroundColor: { control: "color" },
    },
} as Meta;

const Template: Story<DatePickerProps> = (args) => <DatePicker {...args} />;

export const Primary = Template.bind({});
