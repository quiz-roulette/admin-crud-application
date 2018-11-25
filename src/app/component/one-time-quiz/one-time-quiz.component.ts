import { Component, OnInit } from '@angular/core';
import { HTTPService } from '../../service/http.service';
import { QuestionWrapper } from '../../model/questionWrapper';
import { AzureService } from '../../service/azure.service';
import { Category } from '../../model/category';
import { Result } from '../../model/Result';
import * as $ from 'jquery';
import { Quiz } from '../../model/Quiz';
import { Socket } from 'ng-socket-io';

@Component({
    selector: 'one-time-quiz',
    templateUrl: 'one-time-quiz.component.html',
    styleUrls:['one-time-quiz.component.css']
})

export class OneTimeQuizComponent implements OnInit {
    quizes: Quiz[];
    categories: Category[];
    isTrue: boolean;
    selectedCategory: string;
    result: Result;
    searchText: string;

    constructor(private httpService: HTTPService, private azureService: AzureService,private socket: Socket) { 
        this.isTrue = true;
        this.result = new Result();
        this.searchText = "";
        $('#myModal').on('shown.bs.modal', function () {
            $('#myInput').trigger('focus')
          })
    }

    ngOnInit() { 
        this.result.updateInfo("Getting questions...");
        this.getAllQuiz();
        this.selectedCategory = "simaa";
    }

    getAllQuiz(){
        this.result.updateInfo("Getting Quiz...");
        this.httpService.getAllOneTimeQuiz().then((data) => {
            data.forEach((el) => {
                if(el.StartDateTime != null){
                    el.StartDateTime = new Date(el.StartDateTime);
                }
            })
            // console.log(data);
            this.quizes = data;
            this.result.updateSuccess(true);
        }).catch((err) => {
            this.result.updateError("Error!");
        });
    }

    endQuiz(quizid){
        this.result.updateInfo("Ending Quiz...");
        this.httpService.endOneTimeQuiz(quizid).then((data) => {
            this.getAllQuiz();
            this.socket.emit("stop quiz",{QuizId: quizid});
            this.result.updateSuccess(true);
        }).catch((err) => {
            this.result.updateError("Error!");
        });
    }


    updateResult(updatedResult: Result){
        this.result = updatedResult;
    }

    addedQuiz(result){
        this.getAllQuiz();
    }

    redirectToDashboard(quizid){
        window.open("https://it-club-quiz.herokuapp.com/dashboard/"+quizid, "_blank");
    }
}