export type Message = {
    id: string;
    title: string;
    message: string;
    type: string;
    platform?: string;
    read_count?: number;
    created_at?: string;
};

export type UserMessage = {
    id: string;
    message_id?: string;
    user_id?: string;
    title: string;
    message: string;
    type: string;
    questionnaire_id?: string;
    questionnaire_respondent_id?: string;
    read_at?: string;
    created_at?: string;
};
