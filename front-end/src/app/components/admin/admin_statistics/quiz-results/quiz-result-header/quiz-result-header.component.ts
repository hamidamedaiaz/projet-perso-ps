import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService } from 'src/services/stats.service';



@Component({

  selector: 'app-quiz-result-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-result-header.component.html',
  styleUrls: ['./quiz-result-header.component.scss']

})
export class QuizResultHeaderComponent {
  title: string = 'Résultat du Quiz';

  @Output() show_pop_up = new EventEmitter();
  @Output() goBack = new EventEmitter();

  constructor(private statsService: StatsService) { }

  goback(): void {
    console.log("go back")
    this.goBack.emit()
  }

  showPopUp() {
    this.show_pop_up.emit(true);
  }


//     async deleteQuizResult() {
//   try {
//     await this.statsService.deleteQuizResult();
//     this.goback(); // Seulement après succès
//   } catch (err) {
//     alert("Erreur lors de la suppression !");
//     console.error(err);
//   }
// }

}