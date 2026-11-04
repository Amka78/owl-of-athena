import { act, fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { useQuestionnaireStore } from "../../../store/questionnaireStore";
import type { Question } from "../../../types";
import { QuestionnaireDialog } from "../QuestionnaireDialog";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const setupQuestion = (question: Question): void => {
    useQuestionnaireStore.setState({
        questionnaire: {
            id: "q",
            intro_title: "Survey",
            questions: [question],
        },
        respondent: {
            id: "r",
            questionnaire_id: "q",
            current_question: question,
            current_question_index: 0,
            response: [],
        },
        response: [],
        loading: false,
        error: undefined,
    });
};

describe("QuestionnaireDialog UnitTest", () => {
    afterEach(() => {
        useQuestionnaireStore.getState().stopQuestionnaire();
        useQuestionnaireStore.setState({ loading: false, error: undefined });
    });

    it("toggles multiple checkbox choices", () => {
        setupQuestion({
            id: "q1",
            text: "Pick any",
            type: "checkbox",
            choices: [
                { id: "a", label: "Alpha" },
                { id: "b", label: "Beta" },
            ],
        });
        const { getByText } = renderWithProvider(<QuestionnaireDialog />);
        act(() => {
            QuestionnaireDialog.show({});
        });

        fireEvent.press(getByText("Alpha"));
        fireEvent.press(getByText("Beta"));

        expect(useQuestionnaireStore.getState().response).toHaveLength(2);

        fireEvent.press(getByText("Alpha"));

        expect(useQuestionnaireStore.getState().response).toEqual([
            { question_id: "q1", question_choice_id: "b" },
        ]);
    });

    it("stores free text answers", () => {
        setupQuestion({ id: "q1", text: "Tell us", type: "text" });
        const { getByDisplayValue } = renderWithProvider(<QuestionnaireDialog />);
        act(() => {
            QuestionnaireDialog.show({});
        });

        fireEvent.changeText(getByDisplayValue(""), "A good night");

        expect(useQuestionnaireStore.getState().response).toEqual([
            { question_id: "q1", response_text: "A good night" },
        ]);
    });
});
