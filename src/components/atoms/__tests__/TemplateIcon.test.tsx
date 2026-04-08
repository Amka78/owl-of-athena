//#region Import Modules
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TemplateIcon } from '../TemplateIcon';
//#endregion

//#region Tests
describe('TemplateIcon UnitTest', () => {
    it('renders correctly with name="home"', () => {
        const { toJSON } = render(<TemplateIcon name="home" testID="template-icon" />);
        expect(toJSON()).toMatchSnapshot();
    });

    it('calls onPress when pressed', () => {
        const onPress = jest.fn();
        const { getByTestId } = render(
            <TemplateIcon name="home" onPress={onPress} testID="template-icon" />
        );
        fireEvent.press(getByTestId('template-icon'));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
        const onPress = jest.fn();
        const { getByTestId } = render(
            <TemplateIcon name="home" onPress={onPress} disabled={true} testID="template-icon" />
        );
        fireEvent.press(getByTestId('template-icon'));
        expect(onPress).not.toHaveBeenCalled();
    });
});
//#endregion
