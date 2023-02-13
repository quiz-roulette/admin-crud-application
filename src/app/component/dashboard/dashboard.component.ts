import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { HTTPService } from '../../service/http.service';
import { QuizLog } from '../../model/QuizLog';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'quiz-dashboard',
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {
    
    quizname: string;
    quizlogs: QuizLog[];

    constructor(private http: HTTPService, private route: ActivatedRoute, private router: Router) {
        this.quizname = "Dashboard";
        this.quizlogs = [];
    }

    ngOnInit() {
        this.quizname = this.route.snapshot.paramMap.get("quizname")!

        this.http.getAllQuizLog(this.quizname).subscribe((resultEvent: any) => {
            if (resultEvent.type === HttpEventType.Response) {
                var result = resultEvent.body;

                console.log(result);
                result.forEach((element: any) => {
                    var ql = new QuizLog();
                    ql.addQuizInfo(element.QuizUserId, element.TimeTaken, element.Score, element.Result);
                    this.http.getQuizUser(element.QuizUserId).subscribe((resultEvent1: any) => {
                        if (resultEvent1.type === HttpEventType.Response) {
                            var res1 = resultEvent.body;
                            ql.addUserInfo(res1.SIMID, res1.Name, res1.ClubName);
                            this.quizlogs.push(ql);
                        }
                    })
                });
            }
        })

        this.quizlogs.sort(function (a, b) {
            var nameA = a.ClubName!.toUpperCase(); // ignore upper and lowercase
            var nameB = b.ClubName!.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            // names must be equal
            return 0;
        })
    }
}