import React from 'react';
import { Colors, Theme } from "../src/constants";
import { Provider } from "react-native-paper";

/** @type { import('@storybook/react').Preview } */
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: "Aurora",
    values: [
      {
        name: "Aurora",
        value: Colors.navy,
      },
    ],
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <Provider theme={Theme}>
      <Story />
    </Provider>
  ),
];