import { Component, OnInit } from '@angular/core';
import { HTTPService } from '../../service/http.service';
import { QuestionWrapper } from '../../model/questionWrapper';
import { AzureService } from '../../service/azure.service';
import { Category } from '../../model/category';
import { Result } from '../../model/Result';
import * as $ from 'jquery';
import { Quiz } from '../../model/Quiz';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'quiz',
    templateUrl: 'quiz.component.html',
    styleUrls: ['quiz.component.css']
})

export class QuizComponent implements OnInit {
    quizes!: Quiz[];
    categories!: Category[];
    isTrue: boolean;
    selectedCategory!: string;
    result: Result;
    searchText: string;

    constructor(
        private httpService: HTTPService,
        private azureService: AzureService,
        private socket: Socket,
        private router: Router) {
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

    getAllQuiz() {
        this.result.updateInfo("Getting Quiz...");
        this.httpService.getAllQuiz().subscribe((resultEvent: any) => {
            console.log("getting all quiz.. ", resultEvent)
            if (resultEvent.type === HttpEventType.Response) {
                var data = resultEvent.body;
                data.forEach((el: any) => {
                    if (el.StartDateTime != null) {
                        el.StartDateTime = new Date(el.StartDateTime);
                    }
                })
                // console.log(data);
                this.quizes = data;
                this.result.updateSuccess(true);
            }
        })
    }

    endQuiz(quizid: string) {
        this.result.updateInfo("Ending Quiz...");
        this.httpService.endQuiz(quizid).subscribe((resultEvent: any) => {
            console.log("ending quiz.. ", resultEvent)
            if (resultEvent.type === HttpEventType.Response) {
                var data = resultEvent.body;
                this.getAllQuiz();
                this.socket.emit("stop quiz", { QuizId: quizid });
                this.result.updateSuccess(true);
            }
        })
    }


    updateResult(updatedResult: Result) {
        this.result = updatedResult;
    }

    addedQuiz(result: any) {
        this.getAllQuiz();
    }

    redirectToExternalDashboard(quizid: any) {
        window.open("https://it-club-quiz.herokuapp.com/dashboard/" + quizid, "_blank");
    }

    redirectToDashboard(quizid: any) {
        this.router.navigate(['/dashboard', quizid]);
    }
}