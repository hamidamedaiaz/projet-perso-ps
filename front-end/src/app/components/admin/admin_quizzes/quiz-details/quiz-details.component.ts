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
import { FileUploadService } from "../../../../../services/file-upload.service";

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

  public selectedQuestionCopy: Question | null = null;

  private currentQuestionIndex = 0;

  quizCopy: Quiz = EMPTY_QUIZ;

  private tempAudioFile: File | null = null;


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

  constructor(private quizService: QuizListService,
    private popUpService: PopUpService,
    private router: Router,
    private fileUploadService: FileUploadService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['quiz']) {
      // rien à faire ici si le quiz est bien passé via @Input
      this.quizCopy = JSON.parse(JSON.stringify(this.quiz));
    }
  }

  selectQuestion(index: number) {
    if (this.currentQuestionIndex !== index) {
      this.selectedQuestion = this.quizCopy.questions[index];
      this.selectedQuestionCopy = JSON.parse(JSON.stringify(this.selectedQuestion));
      this.currentQuestionIndex = index;
    }
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
    this.selectQuestion(this.quizCopy.questions.length - 1);

  }

  public isQuestionSelected(index: number) {
    if (this.selectedQuestion && this.quizCopy.questions.indexOf(this.selectedQuestion) === index) {
      return true;
    }
    return false;
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
      this.selectedQuestion = null;
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

    const finalizeSave = () => {
      try {
        if (this.selectedQuestion) {
          this.quizService.isQuestionCorrect(this.selectedQuestion);
          this.popUpService.sendPopup(this.questionSavedPopup);
          console.log("Question sauvegardée :", this.selectedQuestion);
        }
      } catch (err) {
        this.popUpService.sendPopup(this.questionErrorPopup);
        console.error("ERROR SAVING QUESTION:", err);
      }
    };

    if (this.tempAudioFile) {
      this.fileUploadService.upload(this.tempAudioFile).subscribe({
        next: (res) => {
          if (this.selectedQuestion) {
            this.selectedQuestion.audioPath = res.filename;
          }
          this.tempAudioFile = null;
          finalizeSave();
        },
        error: (err) => {
          console.error('Erreur lors de l\'upload du fichier audio', err);
          this.popUpService.sendPopup({
            message: 'Erreur lors de l\'upload du fichier audio',
            type: 'error',
            duration: 3000
          });
        }
      });
    } else {
      finalizeSave();
    }
  }


  cancelQuizEditing() {
    this.quizCopy = JSON.parse(JSON.stringify(this.quiz));
    this.selectedQuestion = this.quizCopy.questions[this.currentQuestionIndex]
    this.selectedQuestion = null;
    this.leaveQuizEdition.emit(true);
    this.router.navigate(['/admin'])
  }

  cancelQuestionEditing() {
    this.selectedQuestion = JSON.parse(JSON.stringify(this.selectedQuestionCopy));
    if (this.selectedQuestion) {
      this.quizCopy.questions[this.currentQuestionIndex] = this.selectedQuestion;
    }
  }

  onAudioSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (!file.type.startsWith('audio/')) {
      this.popUpService.sendPopup({
        message: 'Seuls les fichiers audio sont autorisés',
        type: 'warning',
        duration: 3000
      });
      return;
    }

    this.tempAudioFile = file;
  }


}
