import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Quiz } from "src/models/quiz.model";
import { FormsModule } from '@angular/forms';
import { Question } from "src/models/question.model";
import { CommonModule } from '@angular/common';
import { Answer } from "src/models/answer.model";
import { Popup } from "src/models/popup.model";
import { AnswerComponent } from "../answer/answer.component";
import { QuizListService } from "../../../../../services/quiz-list.service";
import { EMPTY_QUIZ } from "../../../../../mocks/quiz.mock";
import { PopUpService } from "../../../../../services/pop-up.service";
import { EMPTY_QUESTION } from 'src/mocks/question.mock';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-details',
  standalone: true,
  imports: [FormsModule, CommonModule, AnswerComponent],
  templateUrl: './quiz-details.component.html',
  styleUrls: ['./quiz-details.component.scss']
})
export class QuizDetailsComponent implements OnChanges {
  @Input() quiz!: Quiz;

  @Output() quizSaved = new EventEmitter<Quiz>();

  @Output() leaveQuizEdition: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  public selectedQuestion: Question | null = null;
  private currentQuestionIndex = 0;

  quizCopy: Quiz = EMPTY_QUIZ;

  errorPopup: Popup = {
    message: "Erreur d'enregistrement",
    type: 'error',
    duration: 5000
  }

  succesPopup: Popup = {
    message: "Quiz sauvegardé",
    type: "success",
    duration: 5000
  }

  questionSavedPopup: Popup = {
    message: "Question sauvegardée",
    type: "success",
    duration: 3000
  }

  questionErrorPopup: Popup = {
    message: "Erreur lors de la sauvegarde de la question",
    type: "error",
    duration: 5000
  }

  constructor(private quizService: QuizListService, private popUpService: PopUpService, private router:Router) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['quiz']) {
      // rien à faire ici si le quiz est bien passé via @Input
      this.quizCopy = JSON.parse(JSON.stringify(this.quiz));
    }
  }

  selectQuestion(index: number) {
    this.selectedQuestion = this.quizCopy.questions[index];
    this.currentQuestionIndex = index;
  }

  addQuestion() {
    const newQuestion: Question = {
      id: this.quizCopy.questions.length + 1,
      question: '',
      answers: [],
      hints: [],
      audioPath: ''
    };
    this.quizCopy.questions.push(newQuestion);
  }

  addAnswer() {
    if (this.selectedQuestion) {
      this.selectedQuestion.answers.push({
        questionId: this.selectedQuestion.id,
        id: this.selectedQuestion.answers.length + 1,
        answerContent: '',
        isCorrect: false
      });
    }
  }

  updateAnswerText(index: number, newText: string) {
    if (this.selectedQuestion) {
      this.selectedQuestion.answers[index].answerContent = newText;
    }
  }

  answerCorrectChange(val: boolean, index: number) {
    if (this.selectedQuestion) {
      this.selectedQuestion.answers[index].isCorrect = val;
    }
  }

  deleteAnswer(answer: Answer) {
    if (this.selectedQuestion) {
      this.selectedQuestion.answers = this.selectedQuestion.answers.filter(a => a.id !== answer.id);
    }
  }

  addHint() {
    this.selectedQuestion?.hints.push('');
  }

  deleteHint(index: number) {
    this.selectedQuestion?.hints.splice(index, 1);
  }

  getSelectedQuestionName(question: Question): string {
    return question.audioPath.split('/').pop() || '';
  }

  saveQuiz() {
    // Quand on save on va emit le quiz modifie pour que quiz app puisse le post sur le serveur.
    console.log("Quiz enregistré :", this.quizCopy);
    try {
      this.quizService.RequestEditQuizzes(this.quizCopy);
      this.popUpService.sendPopup(this.succesPopup);
    }
    catch (err) {
      this.popUpService.sendPopup(this.errorPopup);
      console.log("ERROR QUIZ DETAILS")
    }
    this.quizSaved.emit(this.quizCopy);
  }

  deleteQuestion(index: number) {


    //Si l'utilisateur supprime la question actuellement séléctionné
    if (this.selectedQuestion == this.quizCopy.questions[index]) {
      this.selectedQuestion = EMPTY_QUESTION;
    }

    this.quizCopy.questions.splice(index, 1);
    this.popUpService.sendPopup({
      message: "Question supprimé",
      type: "success",
      duration: 2500
    });

  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  saveQuestion() {
    if (!this.selectedQuestion) {
      this.popUpService.sendPopup({
        message: "Aucune question sélectionnée",
        type: "warning",
        duration: 3000
      });
      return;
    }

    try {
      //on  Mettre à jour la question dans le quiz
      this.quizCopy.questions[this.currentQuestionIndex] = { ...this.selectedQuestion };

      // on Utiliser la validation existante du service
      this.quizService.isQuizCorrect(this.quizCopy);

      // laors Sauvegarder le quiz complet
      this.quizService.RequestEditQuizzes(this.quizCopy);
      this.popUpService.sendPopup(this.questionSavedPopup);
      console.log("Question sauvegardée :", this.selectedQuestion);
    }
    catch (err) {
      this.popUpService.sendPopup(this.questionErrorPopup);
      console.log("ERROR SAVING QUESTION:", err);
    }
  }

  cancelQuizEditing(){
    this.quizCopy = JSON.parse(JSON.stringify(this.quiz));
    this.selectedQuestion = this.quizCopy.questions[this.currentQuestionIndex]
    this.selectedQuestion = null;
    this.leaveQuizEdition.emit(true);
    this.router.navigate(['/admin'])
  }

  cancelQuestionEditing(){
    this.selectedQuestion = this.quiz.questions[this.currentQuestionIndex];
    this.quizCopy.questions[this.currentQuestionIndex] = this.quiz.questions[this.currentQuestionIndex];
  }
}
