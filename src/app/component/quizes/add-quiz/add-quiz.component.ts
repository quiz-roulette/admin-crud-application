import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Result } from '../../../model/Result';
import { HTTPService } from '../../../service/http.service';
import { Category } from '../../../model/category';
import { Group } from '../../../model/Group';
import { Socket } from 'ng-socket-io';

@Component({
    selector: 'add-quiz',
    templateUrl: 'add-quiz.component.html'
})

export class AddQuizComponent implements OnInit {
    selectedCategory: string;
    selectedGroup: string
    result: Result;
    categories: Category[];
    groups: Group[];

    @Output() addedQuiz = new EventEmitter();

    constructor(private httpService: HTTPService,private socket: Socket) {
        this.result = new Result();

        this.httpService.getAllCategories().then((data) => {
            this.categories = data;
            console.log(this.categories);
        })
        this.httpService.getAllGroups().then((data) => {
            this.groups = data;
            console.log(this.groups);
        })
    }

    ngOnInit() { }

    addQuiz(name, category, group) {
        this.result.updateInfo("Starting quiz...");
        if (name && name != "") {
            var quiz = {
                QuizId: name,
                CategoryName: category,
                AdminId: 'exco2018',
                StartDateTime: new Date(),
                EndDateTime: null,
                HasEnded: false,
                GroupName: group
            };
            this.httpService.addQuiz(quiz).then((res) => {
                this.addedQuiz.emit("true");
                this.socket.emit("start quiz",quiz);
                this.result.updateInfo("Quiz Started...");
            });
        }
        else {
            this.result.updateError("Quiz Name not found");
        }
    }

    updateResult(updatedResult: Result) {
        this.result = updatedResult;
    }
}