import QuestionnaireService from "../../services/QuestionnaireService";
import type { Questionnaire, QuestionnaireRespondent } from "../../types";
import { useQuestionnaireStore } from "../questionnaireStore";

jest.mock("../../services/QuestionnaireService", () => ({
    __esModule: true,
    default: {
        getById: jest.fn(),
        getBySlug: jest.fn(),
        startQuestionnaire: jest.fn(),
        resumeQuestionnaire: jest.fn(),
        saveUserResponse: jest.fn(),
        revisitQuestion: jest.fn(),
    },
}));

const questionnaire: Questionnaire = {
    id: "q",
    intro_title: "Survey",
    questions: [
        {
            id: "q1",
            text: "First?",
            type: "radio",
            choices: [{ id: "q1-a", label: "A" }],
        },
        {
            id: "q2",
            text: "Second?",
            type: "checkbox",
            choices: [
                { id: "q2-a", label: "A" },
                { id: "q2-b", label: "B" },
            ],
        },
    ],
};

const respondent = (overrides: Partial<QuestionnaireRespondent> = {}): QuestionnaireRespondent => ({
    id: "r",
    questionnaire_id: "q",
    current_question_index: 0,
    current_question: questionnaire.questions![0],
    response: [],
    ...overrides,
});

describe("questionnaireStore UnitTest", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useQuestionnaireStore.setState({
            questionnaire: undefined,
            respondent: undefined,
            response: [],
            loading: false,
            error: undefined,
            onCompleteCallback: undefined,
        });
    });

    it("starts with the first question", async () => {
        useQuestionnaireStore.setState({ questionnaire });
        (QuestionnaireService.startQuestionnaire as jest.Mock).mockResolvedValue(respondent());

        await useQuestionnaireStore.getState().startQuestionnaire("q");

        expect(QuestionnaireService.startQuestionnaire).toHaveBeenCalledWith(
            "q",
            questionnaire.questions,
        );
        expect(useQuestionnaireStore.getState().respondent?.current_question?.id).toBe("q1");
        expect(useQuestionnaireStore.getState().response).toEqual([]);
    });

    it("merges the current answer and advances to the next question", async () => {
        useQuestionnaireStore.setState({
            questionnaire,
            respondent: respondent({
                response: [
                    { question_id: "q1", question_choice_id: "q1-old" },
                    { question_id: "q0", question_choice_id: "q0-a" },
                ],
            }),
            response: [{ question_id: "q1", question_choice_id: "q1-a" }],
        });
        (QuestionnaireService.saveUserResponse as jest.Mock).mockResolvedValue(
            respondent({
                current_question_index: 1,
                current_question: questionnaire.questions![1],
                response: [
                    { question_id: "q0", question_choice_id: "q0-a" },
                    { question_id: "q1", question_choice_id: "q1-a" },
                ],
            }),
        );

        await useQuestionnaireStore.getState().saveResponse();

        expect(QuestionnaireService.saveUserResponse).toHaveBeenCalledWith(
            "r",
            [
                { question_id: "q0", question_choice_id: "q0-a" },
                { question_id: "q1", question_choice_id: "q1-a" },
            ],
            1,
            questionnaire.questions![1],
            false,
        );
        expect(useQuestionnaireStore.getState().respondent?.current_question?.id).toBe("q2");
        expect(useQuestionnaireStore.getState().response).toEqual([]);
    });

    it("completes after the last question and calls onComplete", async () => {
        const onComplete = jest.fn();
        useQuestionnaireStore.setState({
            questionnaire,
            respondent: respondent({
                current_question_index: 1,
                current_question: questionnaire.questions![1],
            }),
            response: [{ question_id: "q2", question_choice_id: "q2-a" }],
            onCompleteCallback: onComplete,
        });
        (QuestionnaireService.saveUserResponse as jest.Mock).mockResolvedValue(
            respondent({
                current_question_index: 2,
                current_question: undefined,
                completed_at: "2026-11-05T00:00:00.000Z",
            }),
        );

        await useQuestionnaireStore.getState().saveResponse();

        expect(QuestionnaireService.saveUserResponse).toHaveBeenLastCalledWith(
            "r",
            [{ question_id: "q2", question_choice_id: "q2-a" }],
            2,
            undefined,
            true,
        );
        expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it("goes back to the previous question", async () => {
        useQuestionnaireStore.setState({
            questionnaire,
            respondent: respondent({
                current_question_index: 1,
                current_question: questionnaire.questions![1],
            }),
        });
        (QuestionnaireService.revisitQuestion as jest.Mock).mockResolvedValue(
            respondent({
                current_question_index: 0,
                current_question: questionnaire.questions![0],
            }),
        );

        await useQuestionnaireStore.getState().revisitPrevious();

        expect(QuestionnaireService.revisitQuestion).toHaveBeenCalledWith(
            "r",
            0,
            questionnaire.questions![0],
        );
        expect(useQuestionnaireStore.getState().respondent?.current_question?.id).toBe("q1");
    });

    it("hydrates the current question when resuming a legacy respondent", async () => {
        (QuestionnaireService.resumeQuestionnaire as jest.Mock).mockResolvedValue(
            respondent({
                current_question: undefined,
                current_question_index: 1,
            }),
        );
        (QuestionnaireService.getById as jest.Mock).mockResolvedValue(questionnaire);

        await useQuestionnaireStore.getState().resumeQuestionnaire("r");

        expect(useQuestionnaireStore.getState().respondent?.current_question?.id).toBe("q2");
    });
});
