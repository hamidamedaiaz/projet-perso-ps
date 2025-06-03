import { Question } from "src/models/question.model";
import * as ANSWERS from "./answer.mock";

export const QUESTION: Question = {
    id: 0,
    question: "Quel est l'auteur de la chanson Billie Jean ?",
    answers: [
        { ...ANSWERS.ANSWER1, isCorrect: false },
        { ...ANSWERS.ANSWER4, isCorrect: false },
        { ...ANSWERS.ANSWER3, isCorrect: false },
        { ...ANSWERS.ANSWER2, isCorrect: true }
    ],
    hints: [
        "Son surnom est 'The King of Pop'",
        "Il a popularisé le moonwalk",
        "Il a commencé sa carrière avec ses frères dans un groupe célèbre",
        "Il a chanté 'Smooth Criminal', 'Beat It' et 'Black or White'",
    ],
    audioPath: "../../../../assets/musics/Michael Jackson - Billie Jean.mp3"
}

export const QUESTIONS: Question[] = [{
    id: 101,
    question: "Quel groupe a sorti 'Bohemian Rhapsody' en 1975 ?",
    answers: [
      { "id": 101, "questionId": 2, "answerContent": "The Beatles", "isCorrect": false },
      { "id": 101, "questionId": 3, "answerContent": "The Rolling Stones", "isCorrect": false },
      { "id": 101, "questionId": 1, "answerContent": "Queen", "isCorrect": true }
    ],
    hints: ["Le leader du groupe était Freddie Mercury"],
    audioPath: "assets/musics/Michael Jackson - Billie Jean.mp3"
  },
  {
    id: 102,
    question: "Quel album des Pink Floyd est sorti en 1973 ?",
    answers: [
      { id: 102, "questionId": 5, "answerContent": "The Wall", "isCorrect": false },
      { id: 102, "questionId": 6, "answerContent": "Wish You Were Here", "isCorrect": false },
      { id: 102, "questionId": 4, "answerContent": "Dark Side of the Moon", "isCorrect": true }
    ],
    hints: ["La pochette de l'album représente un prisme"],
    audioPath: "assets/musics/Michael Jackson - Billie Jean.mp3"
  },
  {
    id: 103,
    question: "Qui a chanté 'Hotel California' en 1976 ?",
    answers: [
      { id: 103, "questionId": 8, "answerContent": "Fleetwood Mac", "isCorrect": false },
      { id: 103, "questionId": 9, "answerContent": "Led Zeppelin", "isCorrect": false },
      { id: 103, "questionId": 7, "answerContent": "The Eagles", "isCorrect": true }
    ],
    hints: ["Le groupe est connu pour son style country rock"],
    audioPath: "assets/musics/Michael Jackson - Billie Jean.mp3"
  }]

  export const EMPTY_QUESTION: Question = {
    id: 0,
    question: '',
    answers: [],
    hints: [],
    audioPath: '',
  };
