import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { AboutScreenTemplate } from "../AboutScreenTemplate";

const dimens = {
    fontScale: 1,
    scale: 1,
    height: 800,
    width: 400,
    isDesktop: false,
    isLargeWidth: false,
    isSmallHeight: false,
    isVertical: true,
    isHorizontal: false,
};

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("AboutScreenTemplate", () => {
    it("renders app information rows", () => {
        const { getByText } = renderWithProvider(
            <AboutScreenTemplate
                appName="Aurora"
                description="Aurora Client for community user."
                rows={[
                    { label: "Version", value: "1.2.3" },
                    { label: "Build", value: "42" },
                ]}
                repositoryUrl="https://github.com/Amka78/owl-of-athena"
                onRepositoryPress={jest.fn()}
                dimens={dimens}
            />,
        );

        expect(getByText("Aurora")).toBeTruthy();
        expect(getByText("Aurora Client for community user.")).toBeTruthy();
        expect(getByText("Version")).toBeTruthy();
        expect(getByText("1.2.3")).toBeTruthy();
        expect(getByText("Build")).toBeTruthy();
        expect(getByText("42")).toBeTruthy();
    });

    it("opens the repository when the link is pressed", () => {
        const onRepositoryPress = jest.fn();
        const { getByText } = renderWithProvider(
            <AboutScreenTemplate
                appName="Aurora"
                description=""
                rows={[]}
                repositoryUrl="https://github.com/Amka78/owl-of-athena"
                onRepositoryPress={onRepositoryPress}
                dimens={dimens}
            />,
        );

        fireEvent.press(getByText("https://github.com/Amka78/owl-of-athena"));

        expect(onRepositoryPress).toHaveBeenCalledTimes(1);
    });

    it("renders without a repository link", () => {
        const { queryByText } = renderWithProvider(
            <AboutScreenTemplate
                appName="Aurora"
                description=""
                rows={[]}
                repositoryUrl=""
                onRepositoryPress={jest.fn()}
                dimens={dimens}
            />,
        );

        expect(queryByText("https://github.com/Amka78/owl-of-athena")).toBeNull();
    });
});