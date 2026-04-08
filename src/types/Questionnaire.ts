export type QuestionChoice = {
    id: string;
    label: string;
    value?: string | number;
};

export type Question = {
    id: string;
    text: string;
    type: "radio" | "checkbox" | "text";
    choices?: QuestionChoice[];
};

export type QuestionResponse = {
    question_id?: string;
    question_choice_id?: string;
    response_value?: number | null;
    response_text?: string;
};

export type QuestionnaireRespondent = {
    id: string;
    questionnaire_id: string;
    current_question?: Question;
    next_question_id?: string;
    previous_question_id?: string;
    completed_at?: string;
    started_at?: string;
};

export type Questionnaire = {
    id: string;
    slug?: string;
    intro_title: string;
    intro_subtitle?: string;
    intro_text?: string;
    outro_title?: string;
    outro_subtitle?: string;
    outro_text?: string;
};
