import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { HTTPService } from '../../service/http.service';
import { QuizLog } from '../../model/QuizLog';
import { element } from 'protractor';

@Component({
    selector: 'quiz-dashboard',
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {
    quizname: string;
    quizlogs: QuizLog[];
    private sub: Subscription;
    constructor(private http: HTTPService,private route: ActivatedRoute, private router: Router) { 
        this.quizname = "Dashboard";
        this.quizlogs = [];
    }

    ngOnInit() { 
        this.sub = this.route.params.subscribe((params: Params) => {
            this.quizname = params['quizname'];
            // console.log(params);
        });

        this.http.getAllQuizLog(this.quizname).then((res) => {
            console.log(res);
            res.forEach(element => {
                var ql = new QuizLog();
                ql.addQuizInfo(element.QuizUserId, element.TimeTaken, element.Score);
                this.http.getQuizUser(element.QuizUserId).then((res1) => {
                    ql.addUserInfo(res1.SIMID, res1.Name, res1.ClubName);
                })
                this.quizlogs.push(ql);
            });
        })

        this.quizlogs.sort(function(a, b) {
            var nameA = a.ClubName.toUpperCase(); // ignore upper and lowercase
            var nameB = b.ClubName.toUpperCase(); // ignore upper and lowercase
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