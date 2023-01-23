export type QUESTION_TYPE = {
    prompt: string,
    table_name: string,
    tc_table_names: string[],
    base_array?: any // irrelevant
}

export type SUBMIT_RESPONSE_TYPE = {
    is_correct: boolean | null,
    testcases: {
        [questionId: string]: boolean
    }
}