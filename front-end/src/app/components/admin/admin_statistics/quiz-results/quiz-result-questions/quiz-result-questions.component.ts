import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionResult } from 'src/models/question-result.model';
import { Answer } from 'src/models/answer.model';
import { Quiz } from 'src/models/quiz.model';
import { ComputeStatisticService } from 'src/services/computeStatistic.service';

@Component({
  selector: 'app-quiz-result-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-result-questions.component.html',
  styleUrls: ['./quiz-result-questions.component.scss']
})
export class QuizResultQuestionsComponent {
  @Input() quiz!: Quiz;
  @Input() questionResults: QuestionResult[] = [];

  constructor(private computeStatisticService: ComputeStatisticService) { }

  getScoreClass(isCorrect: boolean): string { return isCorrect ? 'correct' : 'incorrect'; }

  isQuestionCorrect(result: QuestionResult) { return this.computeStatisticService.isQuestionCorrect(this.quiz, result) }

  getQuestion(index: number) { return this.quiz.questions[index]; }

  getQuizAnswers(index: number) { return this.quiz.questions[index].answers; }

  isUserAnswer(answer: Answer, questionIndex: number): boolean {
    try {
      if (this.questionResults[questionIndex].answerIds.includes(answer.id)) return true;
    } catch (err) { console.log(err); return false; }
    return false;
  }

  isCorrectAnswer(answer: Answer): boolean { return answer.isCorrect; }

  getTimeSpent(result:QuestionResult){ return Math.round(result.timeSpent/1000) }

  getHintsUsed(result: QuestionResult){ return result.numberOfHintsUsed }

  getQuestionResults(){ return this.questionResults}

  getTryIndex(a: Answer, indexQ: number): number {
    return this.questionResults[indexQ].answerIds.findIndex(id => id === a.id);
  }

}
