import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Result } from '../../../model/Result';
import { HTTPService } from '../../../service/http.service';
import { Category } from '../../../model/category';
import { Group } from '../../../model/Group';
import { Socket } from 'ngx-socket-io';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'add-quiz',
    templateUrl: 'add-quiz.component.html'
})

export class AddQuizComponent implements OnInit {
    selectedCategory!: string;
    selectedGroup!: string
    result: Result;
    categories!: Category[];
    groups!: Group[];

    @Output() addedQuiz = new EventEmitter();

    constructor(private httpService: HTTPService, private socket: Socket) {
        this.result = new Result();

        this.httpService.getAllCategories().subscribe((resultEvent: any) => {
            console.log("get all categories ..", resultEvent)
            if (resultEvent.type === HttpEventType.Response) {
                var data = resultEvent.body;
                this.categories = data;
            }
        })
        this.httpService.getAllGroups().subscribe((resultEvent: any) => {
            console.log("get all groups ..", resultEvent)
            if (resultEvent.type === HttpEventType.Response) {
                var data = resultEvent.body;
                this.groups = data;
            }
        })
    }

    ngOnInit() { }

    addQuiz(name: any, category: any, group: any, questionCount: any) {
        this.result.updateInfo("Starting quiz...");
        if (name && name != "") {
            var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
            if (!format.test(name)) {
                this.httpService.getCategoryQuestionCount(category).subscribe((resultEvent: any) => {
                    console.log("get category question count", resultEvent)
                    if (resultEvent.type === HttpEventType.Response) {
                        var resobj = resultEvent.body;

                        if (resobj.Count >= questionCount) {
                            if (questionCount == 0) questionCount = resobj.Count;
                            var quiz = {
                                QuizId: name,
                                CategoryName: category,
                                AdminId: localStorage.getItem('user'),
                                QuestionCount: questionCount,
                                StartDateTime: new Date(),
                                EndDateTime: null,
                                HasEnded: false,
                                GroupName: group
                            };
                            this.httpService.addQuiz(quiz).subscribe((resultEvent1: any) => {
                                console.log("addding quiz ... ", resultEvent1)
                                if (resultEvent.type === HttpEventType.Response) {
                                    var resobj = resultEvent.body;
                                    this.addedQuiz.emit("true");
                                    this.socket.emit("start quiz", quiz);
                                    this.result.updateInfo("Quiz Started...");
                                }
                            })
                        }
                    }
                    else {
                        this.result.updateError("You cannot ask question more than the question in database!");
                    }
                })
            }
            else {
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