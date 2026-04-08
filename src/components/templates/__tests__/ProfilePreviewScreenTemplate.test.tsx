import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { ProfilePreviewScreenTemplate } from '../ProfilePreviewScreenTemplate';

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe('ProfilePreviewScreenTemplate', () => {
    it('renders correctly with content', () => {
        const { toJSON } = renderWithProvider(
            <ProfilePreviewScreenTemplate content={JSON.stringify({ name: 'default.prof' })} />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly with empty content', () => {
        const { toJSON } = renderWithProvider(
            <ProfilePreviewScreenTemplate content="" />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('displays the content in the text input', () => {
        const content = '{"name":"default.prof"}';
        const { getByDisplayValue } = renderWithProvider(
            <ProfilePreviewScreenTemplate content={content} />
        );
        expect(getByDisplayValue(content)).toBeTruthy();
    });
});
