import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import React from 'react';
import { Text } from 'react-native';
import { MenuContainer } from '../../components/atoms/MenuContainer';

const meta = {
  title: 'Atoms/MenuContainer',
  component: MenuContainer,
  tags: ['autodocs'],
} satisfies Meta<typeof MenuContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { children: undefined as unknown as React.ReactNode },
  render: (args) => (
    <MenuContainer {...args}>
      <Text>Menu Item</Text>
    </MenuContainer>
  ),
  play: async ({ canvasElement }) => {
    expect(canvasElement).toBeTruthy();
  },
};

export const MultipleItems: Story = {
  args: { children: undefined as unknown as React.ReactNode },
  render: (args) => (
    <MenuContainer {...args}>
      <Text>Menu Item 1</Text>
      <Text>Menu Item 2</Text>
      <Text>Menu Item 3</Text>
    </MenuContainer>
  ),
};
