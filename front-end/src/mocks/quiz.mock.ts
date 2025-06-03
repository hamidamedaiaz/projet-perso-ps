import { Quiz } from "src/models/quiz.model";
import { EMPTY_QUESTION } from "src/mocks/question.mock"

export const EMPTY_QUIZ: Quiz = {
  "id": -1,
  "title": "Empty Quiz",
  "questions": []
}

export const QUIZ_EXAMPLE: Quiz = {
  "id": 1747172294366,
  "title": "Quiz Rock des années 70-80",
  "questions": [
    {
      "id": 101,
      "question": "Quel groupe a sorti 'Bohemian Rhapsody' en 1975 ?",
      "answers": [
        {
          "questionId": 101,
          "id": 2,
          "answerContent": "The Beatles",
          "isCorrect": false
        },
        {
          "questionId": 101,
          "id": 3,
          "answerContent": "The Rolling Stones",
          "isCorrect": false
        },
        {
          "questionId": 101,
          "id": 4,
          "answerContent": "Genesis",
          "isCorrect": false
        },
        {
          "questionId": 101,
          "id": 1,
          "answerContent": "Queen",
          "isCorrect": true
        }
      ],
      "hints": [
        "Le leader du groupe était Freddie Mercury"
      ],
      "audioPath": "assets/musics/Michael Jackson - Billie Jean.mp3"
    },
    {
      "id": 102,
      "question": "Quel album des Pink Floyd est sorti en 1973 ?",
      "answers": [
        {
          "questionId": 102,
          "id": 5,
          "answerContent": "The Wall",
          "isCorrect": false
        },
        {
          "questionId": 102,
          "id": 6,
          "answerContent": "Wish You Were Here",
          "isCorrect": false
        },
        {
          "questionId": 102,
          "id": 7,
          "answerContent": "Animals",
          "isCorrect": false
        },
        {
          "questionId": 102,
          "id": 4,
          "answerContent": "Dark Side of the Moon",
          "isCorrect": true
        }
      ],
      "hints": [
        "La pochette de l'album représente un prisme"
      ],
      "audioPath": "assets/musics/Michael Jackson - Billie Jean.mp3"
    },
    {
      "id": 103,
      "question": "Qui a chanté 'Hotel California' en 1976 ?",
      "answers": [
        {
          "questionId": 103,
          "id": 8,
          "answerContent": "Fleetwood Mac",
          "isCorrect": false
        },
        {
          "questionId": 103,
          "id": 9,
          "answerContent": "Led Zeppelin",
          "isCorrect": false
        },
        {
          "questionId": 103,
          "id": 10,
          "answerContent": "Creedence Clearwater Revival",
          "isCorrect": false
        },
        {
          "questionId": 103,
          "id": 7,
          "answerContent": "The Eagles",
          "isCorrect": true
        }
      ],
      "hints": [
        "Le groupe est connu pour son style country rock"
      ],
      "audioPath": "assets/musics/Michael Jackson - Billie Jean.mp3"
    }
  ]
}

export const QUIZ_EXAMPLE2: Quiz = {
  "id": 1747172294367,
  "title": "Quiz Disco & Funk des années 70-80",
  "questions": [
    {
      "id": 201,
      "question": "Qui a chanté 'Stayin' Alive' en 1977 ?",
      "answers": [
        {
          "questionId": 201,
          "id": 11,
          "answerContent": "Earth, Wind & Fire",
          "isCorrect": false
        },
        {
          "questionId": 201,
          "id": 12,
          "answerContent": "Kool & The Gang",
          "isCorrect": false
        },
        {
          "questionId": 201,
          "id": 13,
          "answerContent": "Village People",
          "isCorrect": false
        },
        {
          "questionId": 201,
          "id": 10,
          "answerContent": "Bee Gees",
          "isCorrect": true
        }
      ],
      "hints": [
        "Chanson emblématique du film 'Saturday Night Fever'"
      ],
      "audioPath": "assets/musics/Michael Jackson - Billie Jean.mp3"
    },
    {
      "id": 202,
      "question": "Quel est le tube le plus célèbre de Michael Jackson en 1983 ?",
      "answers": [
        {
          "questionId": 202,
          "id": 13,
          "answerContent": "Beat It",
          "isCorrect": false
        },
        {
          "questionId": 202,
          "id": 15,
          "answerContent": "Thriller",
          "isCorrect": false
        },
        {
          "questionId": 202,
          "id": 16,
          "answerContent": "Wanna Be Startin' Somethin'",
          "isCorrect": false
        },
        {
          "questionId": 202,
          "id": 14,
          "answerContent": "Billie Jean",
          "isCorrect": true
        }
      ],
      "hints": [
        "Le clip montre le chanteur marcher sur des dalles lumineuses"
      ],
      "audioPath": "assets/musics/Michael Jackson - Billie Jean.mp3"
    },
    {
      "id": 203,
      "question": "Quel groupe a chanté 'Le Freak' en 1978 ?",
      "answers": [
        {
          "questionId": 203,
          "id": 17,
          "answerContent": "Village People",
          "isCorrect": false
        },
        {
          "questionId": 203,
          "id": 18,
          "answerContent": "Boney M.",
          "isCorrect": false
        },
        {
          "questionId": 203,
          "id": 19,
          "answerContent": "KC and the Sunshine Band",
          "isCorrect": false
        },
        {
          "questionId": 203,
          "id": 16,
          "answerContent": "Chic",
          "isCorrect": true
        }
      ],
      "hints": [
        "Le refrain contient 'Freak out!'"
      ],
      "audioPath": "assets/musics/Michael Jackson - Billie Jean.mp3"
    }
  ]
}