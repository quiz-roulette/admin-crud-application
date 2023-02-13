import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Result } from '../../../model/Result';
import { HTTPService } from '../../../service/http.service';
import { Category } from '../../../model/category';
import { Socket } from 'ngx-socket-io';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'add-one-time-quiz',
    templateUrl: 'add-one-time-quiz.component.html'
})

export class AddOneTimeQuizComponent implements OnInit {
    selectedCategory!: string;
    selectedGroup!: string
    result: Result;
    categories!: Category[];

    @Output() addedQuiz = new EventEmitter();

    constructor(private httpService: HTTPService, private socket: Socket) {
        this.result = new Result();

        this.httpService.getAllCategories().subscribe((resultEvent: any) => {
            if (resultEvent.type === HttpEventType.Response) {
                var data = resultEvent.body;
                this.categories = data;
            }
        })
    }

    ngOnInit() { }

    addQuiz(name: string, category: string, questionCount: any, passingpercentage: any) {
        console.log(questionCount);
        passingpercentage = passingpercentage ? passingpercentage : null;
        this.result.updateInfo("Starting quiz...");
        var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        if (name && name != "") {
            if (!format.test(name)) {
                this.httpService.getCategoryQuestionCount(category).subscribe((resultEvent: any) => {
                    if (resultEvent.type === HttpEventType.Response) {
                        var resobj = resultEvent.body;


                        if (resobj.Count >= questionCount) {
                            var quiz = {
                                QuizId: name,
                                CategoryName: category,
                                AdminId: localStorage.getItem('user'),
                                QuestionCount: questionCount,
                                PassingPercentage: passingpercentage,
                                StartDateTime: new Date(),
                                EndDateTime: null,
                                HasEnded: false
                            };
                            this.httpService.addOneTimeQuiz(quiz).then((resultEvent1: any) => {
                                if (resultEvent1.type === HttpEventType.Response) {
                                    var res = resultEvent1.body;
                                    this.addedQuiz.emit("true");
                                    this.socket.emit("start quiz", quiz);
                                    this.result.updateInfo("Quiz Started...");
                                }
                            })
                        }
                        else {
                            this.result.updateError("You cannot ask question more than the question in database!");
                        }
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