import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { ListItem } from '../../components/atoms/ListItem';

const meta = {
  title: 'Atoms/ListItem',
  component: ListItem,
  tags: ['autodocs'],
  decorators: [
    (Story: any) => <Provider theme={Theme}><Story /></Provider>,
  ],
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    title: 'List Item Title',
    description: 'Description',
  },
  play: async ({ canvasElement }) => {
    
    expect(canvasElement).toBeTruthy();
  },
};

export const WithPressHandler: Story = {
  args: {
    title: 'List Item Title',
    description: 'Description',
    onPress: fn(),
  },
};

export const Disabled: Story = {
  args: {
    title: 'List Item Title',
    description: 'Description',
    disabled: true,
  },
};

export const NoDescription: Story = {
  args: {
    title: 'List Item Title',
  },
};
