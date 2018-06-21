import { Component, OnInit, OnDestroy } from '@angular/core';
import { Result } from '../../../model/Result';
import { QuizUser, QuizUserCheck } from '../../../model/QuizUser';
import { Group } from '../../../model/Group';
import { HTTPService } from '../../../service/http.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
    selector: 'assign-user',
    templateUrl: 'assign-user.component.html',
    styleUrls: ['assign-user.component.css']
})



export class AssignUserComponent implements OnInit, OnDestroy {
    quizUsers: QuizUser[];
    checkedQuizUsers: QuizUser[];
    checkedList: string[];
    quizUserCheck: QuizUserCheck[];
    group: Group;
    result: Result;
    private sub: Subscription;
    public groupId: string;

    ngOnInit() {
        // assign the subscription to a variable so we can unsubscribe to prevent memory leaks
        this.sub = this.route.params.subscribe((params: Params) => {
            this.groupId = params['groupname'];
            console.log(params);
        });

        this.result.updateInfo("Getting Users...")
        this.http.getAllQuizUsers().then((res) => {
            this.quizUsers = res;
            this.result.updateInfo("Getting Users from this group...")
            this.http.getUsersForGroup(this.groupId).then((res1) => {
                this.checkedQuizUsers = res1;
                this.setCheckedValues();
            });
        });
    }

    constructor(private http: HTTPService, private route: ActivatedRoute, private router: Router) {
        this.result = new Result();
        this.quizUsers = [];
        this.checkedQuizUsers = [];
        this.checkedList = [];
        this.quizUserCheck = [];
    }

    onCheckboxChange(option, event) {
        var newCheckUser = [];
        this.quizUserCheck.forEach((el) => {
            if (el.QuizUserId === option.QuizUserId) {
                newCheckUser.push(new QuizUserCheck(el.QuizUserId,event.target.checked));
            }
            else{
                newCheckUser.push(new QuizUserCheck(el.QuizUserId,el.Checked));
            }
        });
        this.quizUserCheck = newCheckUser;
    }

    assign(){
        this.result.updateInfo("updating database...");
        var users = [];
        this.quizUserCheck.forEach((el) => {
            if(el.Checked) users.push(el.QuizUserId);
        })
        this.http.assignCustomUsersToGroup(users,this.groupId).then((res) => {
            this.result.updateSuccess(true);
        });
    }

    setCheckedValues() {
        this.result.updateInfo("Updating view...")
        this.quizUsers.forEach((el) => {
            var foundObj = null;
            this.checkedQuizUsers.forEach((el1) => {
                if (el.QuizUserId === el1.QuizUserId) {
                    foundObj = el1;
                }
            });
            if (foundObj) this.quizUserCheck.push(new QuizUserCheck(foundObj.QuizUserId, true));
            else this.quizUserCheck.push(new QuizUserCheck(el.QuizUserId, false));
        });
        this.result.updateSuccess(true);
    }

    updateResult(result: Result) {
        this.result = result;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}