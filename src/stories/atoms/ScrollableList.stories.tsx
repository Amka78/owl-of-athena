import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import React from 'react';
import { Text } from 'react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { ScrollableList } from '../../components/atoms/ScrollableList';

const meta = {
  title: 'Atoms/ScrollableList',
  component: ScrollableList,
  tags: ['autodocs'],
  decorators: [
    (Story: any) => <Provider theme={Theme}><Story /></Provider>,
  ],
} satisfies Meta<typeof ScrollableList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: (args): React.ReactElement => (
    <ScrollableList {...args}>
      {[
        <Text key="1">Item 1</Text>,
        <Text key="2">Item 2</Text>,
      ]}
    </ScrollableList>
  ),
  play: async ({ canvasElement }) => {
    expect(canvasElement).toBeTruthy();
  },
};

export const ManyItems: Story = {
  render: (args): React.ReactElement => (
    <ScrollableList {...args}>
      {Array.from({ length: 10 }, (_, i) => (
        <Text key={i}>Item {i + 1}</Text>
      ))}
    </ScrollableList>
  ),
};
