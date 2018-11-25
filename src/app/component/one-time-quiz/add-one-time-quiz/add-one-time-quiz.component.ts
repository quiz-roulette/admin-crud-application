import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Result } from '../../../model/Result';
import { HTTPService } from '../../../service/http.service';
import { Category } from '../../../model/category';
import { Group } from '../../../model/Group';
import { Socket } from 'ng-socket-io';

@Component({
    selector: 'add-one-time-quiz',
    templateUrl: 'add-one-time-quiz.component.html'
})

export class AddOneTimeQuizComponent implements OnInit {
    selectedCategory: string;
    selectedGroup: string
    result: Result;
    categories: Category[];

    @Output() addedQuiz = new EventEmitter();

    constructor(private httpService: HTTPService, private socket: Socket) {
        this.result = new Result();

        this.httpService.getAllCategories().then((data) => {
            this.categories = data;
            // console.log(this.categories);
        })
    }

    ngOnInit() { }

    addQuiz(name, category) {
        this.result.updateInfo("Starting quiz...");
        var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        if (name && name != "") {
            if (!format.test(name)) {
                var quiz = {
                    QuizId: name,
                    CategoryName: category,
                    AdminId: localStorage.getItem('user'),
                    StartDateTime: new Date(),
                    EndDateTime: null,
                    HasEnded: false
                };
                this.httpService.addOneTimeQuiz(quiz).then((res) => {
                    this.addedQuiz.emit("true");
                    this.socket.emit("start quiz", quiz);
                    this.result.updateInfo("Quiz Started...");
                }).catch((err) => {
                    this.result.updateError("Error!");
                });
            }
            else{
                this.result.updateError("Quiz Name Cannot contain special characters");
            }
        }
        else {
            this.result.updateError("Quiz Name not found");
        }
    }

    updateResult(updatedResult: Result) {
        this.result = updatedResult;
    }
}