import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { AwakeScreenTemplate } from '../AwakeScreenTemplate';


const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const mobileDimens = {
    fontScale: 1, scale: 1, height: 800, width: 400,
    isDesktop: false, isLargeWidth: false, isSmallHeight: false,
    isVertical: true, isHorizontal: false,
};

describe('AwakeScreenTemplate', () => {
    it('renders correctly with en-US locale', () => {
        const { toJSON } = renderWithProvider(
            <AwakeScreenTemplate
                questionnaireButton={{ onPress: jest.fn() }}
                skipButton={{ onPress: jest.fn() }}
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly with ja-JP locale', () => {
        const { toJSON } = renderWithProvider(
            <AwakeScreenTemplate
                questionnaireButton={{ onPress: jest.fn() }}
                skipButton={{ onPress: jest.fn() }}
                dimens={mobileDimens}
                locale="ja-JP"
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('calls questionnaireButton.onPress when continue pressed', () => {
        const onPress = jest.fn();
        const { getByText } = renderWithProvider(
            <AwakeScreenTemplate
                questionnaireButton={{ onPress }}
                skipButton={{ onPress: jest.fn() }}
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        fireEvent.press(getByText(/continue/i));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('calls skipButton.onPress when skip pressed', () => {
        const onPress = jest.fn();
        const { getByText } = renderWithProvider(
            <AwakeScreenTemplate
                questionnaireButton={{ onPress: jest.fn() }}
                skipButton={{ onPress }}
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        fireEvent.press(getByText(/skip/i));
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});
