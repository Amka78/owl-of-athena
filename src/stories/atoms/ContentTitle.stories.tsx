import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { ContentTitle } from '../../components/atoms/ContentTitle';

const meta = {
  title: 'Atoms/ContentTitle',
  component: ContentTitle,
  tags: ['autodocs'],
  decorators: [
    (Story: any) => <Provider theme={Theme}><Story /></Provider>,
  ],
} satisfies Meta<typeof ContentTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Test',
  },
  play: async ({ canvasElement }) => {
    
    expect(canvasElement).toBeTruthy();
  },
};
