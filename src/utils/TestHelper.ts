import "../components";

import { shallow, ShallowWrapper } from "enzyme";
import enzymetoJson from "enzyme-to-json";
import {
    GestureResponderEvent,
    NativeSyntheticEvent,
    TextInputEndEditingEventData,
} from "react-native";

import { ButtonProps } from "../components/atoms/Button";

// @ts-ignore
export const FakeGestureResponderEvent: GestureResponderEvent = {};
// @ts-ignore
export const FakeTextBoxOnEndEditingEventData: NativeSyntheticEvent<TextInputEndEditingEventData> = {};

export function createMock<P, S>(comp: any): ShallowWrapper<P, S> {
    return shallow<P, S>(comp);
}

export function toJson(wrapper: any) {
    return enzymetoJson(wrapper);
}

/**
 * TestIDを利用してComponetのPropsを取得します。
 *
 * @static
 * @template T Propsの型を指定
 * @param {ShallowWrapper} component
 * @param {string} name
 * @param {string} testId
 * @returns {T}
 * @memberof TestHelper
 */
export function getComponentPropsByTestID<T>(
    component: ShallowWrapper<any, any>,
    name: string,
    testId: string
): T | undefined {
    const findComponent = component.find(name).findWhere((wrapper: any) => {
        const targetProps = wrapper.props();
        return targetProps.testID === testId;
    });
    if (findComponent.length <= 0) {
        return undefined;
    }
    const props: T = findComponent.props();
    return props;
}

export function getButtonPropsByTestID(
    component: ShallowWrapper<any, any>,
    testID: string
): ButtonProps | undefined {
    return getComponentPropsByTestID<ButtonProps>(
        component,
        "MultiLingualButton",
        testID
    );
}

/*public static getTextBoxPropsByTestID(
        component: ShallowWrapper<any, any>,
        testID: string
    ): ITextBoxProps | undefined {
        return this.getComponentPropsByTestID<ITextBoxProps>(
            component,
            "MultiLingualTextBox",
            testID
        );
    }

    public static getHeaderSearchBarPropsByTestID(
        component: ShallowWrapper<any, any>,
        testID: string
    ): IHeaderSearchBarProps | undefined {
        return this.getComponentPropsByTestID<IHeaderSearchBarProps>(
            component,
            "HeaderSearchBar",
            testID
        );
    }

    public static getListItemPropsByTestID(
        component: ShallowWrapper<any, any>,
        testID: string
    ): IListItemProps | undefined {
        return this.getComponentPropsByTestID<IListItemProps>(
            component,
            "MultiLingualListItem",
            testID
        );
    }*/

/*public static createNavigationMock(
        param: Partial<NavigationScreenProp<any, any>>
    ): NavigationScreenProp<any, any> {
        const navigation = new Object();
        Object.assign(navigation, param);
        return navigation as NavigationScreenProp<any, any>;
    }*/
