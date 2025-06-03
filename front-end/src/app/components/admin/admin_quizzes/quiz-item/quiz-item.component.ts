import {Component, EventEmitter, Input, Output} from '@angular/core';
import {QuizListService} from "src/services/quiz-list.service";
import {NgOptimizedImage, CommonModule} from "@angular/common";
import {Quiz} from "src/models/quiz.model";
import {CurrentPageService } from 'src/services/currentPage.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-quiz-item',
  standalone: true,
  imports: [
    NgOptimizedImage, CommonModule
  ],
  templateUrl: './quiz-item.component.html',
  styleUrl: './quiz-item.component.scss'
})

export class QuizItemComponent {

  @Input() 
  quiz!:Quiz;

  @Input() 
  context?:String

  @Output()
  launchMultiGameEmitter: EventEmitter<Quiz> = new EventEmitter<Quiz>();

  @Output()
  launchSoloGameEmitter: EventEmitter<Quiz> = new EventEmitter<Quiz>();

  @Output()
  deleteQuiz: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  currentPage:String=this.currentPageService.getCurrentPage();

  public showDeleteConfirm: Boolean = false;

  constructor(private quizService: QuizListService, private currentPageService: CurrentPageService) {
    console.log("current page: ",this.currentPage);
  }

  onEditClick(){
    this.quizService.selectQuizForEdition(this.quiz)
  }

  onDeleteClick(){
    this.deleteQuiz.emit(true)
  }

  

  launchMultiGame(){
    return this.launchMultiGameEmitter.emit(this.quiz);
  }

  launchSoloGame(){
    return this.launchSoloGameEmitter.emit(this.quiz);
  }
}
