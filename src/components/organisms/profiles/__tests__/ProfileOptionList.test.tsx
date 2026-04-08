import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../../constants';
import { ProfileOptionList } from '../ProfileOptionList';
import { defaultOptions, groupingProfileOptionList } from '../../../../services/ProfileService';

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const groupedOptionList = groupingProfileOptionList(defaultOptions);

describe('ProfileOptionList', () => {
    it('renders correctly with en-US locale', () => {
        const { toJSON } = renderWithProvider(
            <ProfileOptionList
                groupedOptionList={groupedOptionList}
                locale="en-US"
                style={{ flex: 1 }}
                onHelpIconPress={jest.fn()}
                onValueChange={jest.fn()}
            />
        );
        expect(toJSON()).toBeTruthy();
    });

    it('renders correctly with ja-JP locale', () => {
        const { toJSON } = renderWithProvider(
            <ProfileOptionList
                groupedOptionList={groupedOptionList}
                locale="ja-JP"
                style={{ flex: 1 }}
                onHelpIconPress={jest.fn()}
                onValueChange={jest.fn()}
            />
        );
        expect(toJSON()).toBeTruthy();
    });

    it('renders with empty option list', () => {
        const { toJSON } = renderWithProvider(
            <ProfileOptionList
                groupedOptionList={[]}
                style={{ flex: 1 }}
            />
        );
        expect(toJSON()).toBeTruthy();
    });
});
