import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import React from 'react';
import { Text } from 'react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { StandardView } from '../../components/atoms/StandardView';

const meta = {
  title: 'Atoms/StandardView',
  component: StandardView,
  tags: ['autodocs'],
  decorators: [
    (Story: any) => <Provider theme={Theme}><Story /></Provider>,
  ],
} satisfies Meta<typeof StandardView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { children: undefined as unknown as React.ReactNode },
  render: (args) => (
    <StandardView {...args}>
      <Text>Content</Text>
    </StandardView>
  ),
  play: async ({ canvasElement }) => {
    expect(canvasElement).toBeTruthy();
  },
};
