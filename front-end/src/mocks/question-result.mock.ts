import { QuestionResult } from "src/models/question-result.model";
import { Answer } from "src/models/answer.model";
import { QUIZ_EXAMPLE, QUIZ_EXAMPLE2 } from "./quiz.mock";

function getAnswersIds(answers:Answer[]):number[]{
    let ids:number[] = []
    answers.forEach(element => {
        ids.push(element.id)
    });
    return ids;
}

export const QUESTION_RESULT: QuestionResult[] =
    [{
        id: 0,
        quizId: QUIZ_EXAMPLE.id,
        questionId: QUIZ_EXAMPLE.questions[0].id,
        answerIds: getAnswersIds(QUIZ_EXAMPLE.questions[0].answers),
        timeSpent: 15,
        numberOfHintsUsed: 3
    },
    {
        id: 1,
        quizId: QUIZ_EXAMPLE.id,
        questionId: QUIZ_EXAMPLE.questions[1].id,
        answerIds: getAnswersIds(QUIZ_EXAMPLE.questions[1].answers),
        timeSpent: 35,
        numberOfHintsUsed: 1
    },
    {
        id: 2,
        quizId: QUIZ_EXAMPLE.id,
        questionId: QUIZ_EXAMPLE.questions[2].id,
        answerIds: [], 
        timeSpent: 12,
        numberOfHintsUsed: 1
    }
]

export const QUESTION_RESULT2: QuestionResult[] =
    [{
        id: 3,
        quizId: QUIZ_EXAMPLE2.id,
        questionId: QUIZ_EXAMPLE2.questions[0].id,
        answerIds: getAnswersIds(QUIZ_EXAMPLE2.questions[0].answers),
        timeSpent: 15,
        numberOfHintsUsed: 3
    },
    {
        id: 4,
        quizId: QUIZ_EXAMPLE2.id,
        questionId: QUIZ_EXAMPLE2.questions[1].id,
        answerIds: [],
        timeSpent: 35,
        numberOfHintsUsed: 1
    },
    {
        id: 5,
        quizId: QUIZ_EXAMPLE2.id,
        questionId: QUIZ_EXAMPLE2.questions[2].id,
        answerIds: [],
        timeSpent: 12,
        numberOfHintsUsed: 1
    }
]