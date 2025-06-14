import { Injectable } from "@angular/core";
import { QuestionResult } from "src/models/question-result.model";
import { QuizResult } from "src/models/quiz-result.model";
import { SessionHistory } from "src/models/session-history.model";
import { SessionQuestionResult } from "src/models/session-result.model";
import { ComputeStatisticService } from "./computeStatistic.service";
import { QuizResultService } from "./quiz-result.service";

@Injectable({
    providedIn: 'root'
})

export class SessionResultService {

    constructor(private computeStatisticService: ComputeStatisticService, private quizResultService:QuizResultService) {}
    
    public getSessionResults(sessionHistory: SessionHistory) {

        let sessionQuestionResults: SessionQuestionResult[] = [];

        sessionHistory.quizResults.forEach(quizResult => {
            quizResult.questionResults.forEach((questionResult) => {

                const index = this.getSessionQuestionResultIndex(sessionQuestionResults, questionResult.questionId);

                if (index !== -1) sessionQuestionResults[index].questionResults.push(questionResult); 
                else  sessionQuestionResults
                        .push(this.createNewSessionQuestionResult(questionResult, sessionHistory.sessionId, sessionHistory.quizId));
            })
        })

        return sessionQuestionResults;
    }

    public getSessionQuizResults(sessionId:string){
        return this.quizResultService.getQuizResults(sessionId);
    }

    private getSessionQuestionResultIndex(sessionQuestionResults: SessionQuestionResult[], questionId: number): number {
        return sessionQuestionResults.findIndex(result => result.questionId === questionId);
    }

    private createNewSessionQuestionResult(questionResult: QuestionResult, sessionId: string, quizId: number): SessionQuestionResult {
        return {
            sessionId: sessionId,
            quizId: quizId,
            questionId: questionResult.questionId,
            questionResults: [questionResult]
        }
    }

    public formatQuizResultToSessionHistory(quizResults: QuizResult[]) {

        let sessionHistory: SessionHistory[] = [];

        try {
            let sessionIds = this.getDistinctSessionId(quizResults);
            sessionIds.forEach(sessionId => {
                let currentQuizResults: QuizResult[] = quizResults.filter(quizResult => quizResult.sessionId === sessionId && quizResult.gamemode.id === 1);
                sessionHistory.push(this.createSessionHistory(currentQuizResults));
            })

        } catch (err) { console.log(err) }

        return sessionHistory;
    }

    private createSessionHistory(quizResults:QuizResult[]){
        return {
                    sessionId: quizResults[0].sessionId,
                    quizId: quizResults[0].quizId,
                    dateDebut: this.computeStatisticService.convertTimeStampToDate(quizResults[0].dateDebut),
                    averageScore: this.computeStatisticService.getAverageScore(quizResults),
                    numberOfQuestions: quizResults[0].questionResults.length,
                    numberOfplayers: quizResults[0].players.length,
                    quizResults: quizResults
                };
    }

    private getDistinctSessionId(quizResults: QuizResult[]) {
        let sessionIds: string[] = [];
        quizResults.forEach(quizResult => {
            if (!sessionIds.includes(quizResult.sessionId)) sessionIds.push(quizResult.sessionId);
        })
        return sessionIds;
    }
}
