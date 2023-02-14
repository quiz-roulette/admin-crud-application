import { Component, OnInit, OnDestroy } from '@angular/core';
import { Result } from '../../../model/Result';
import { QuizUser, QuizUserCheck } from '../../../model/QuizUser';
import { Group } from '../../../model/Group';
import { HTTPService } from '../../../service/http.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'assign-user',
    templateUrl: 'assign-user.component.html',
    styleUrls: ['assign-user.component.css']
})



export class AssignUserComponent implements OnInit {
    quizUsers: QuizUser[];
    checkedQuizUsers: QuizUser[];
    checkedList: string[];
    quizUserCheck: QuizUserCheck[];
    group!: Group;
    result: Result;
    public groupId!: string;

    ngOnInit() {
        this.groupId = this.route.snapshot.paramMap.get("groupname")!


        this.result.updateInfo("Getting Users...")
        this.http.getAllQuizUsers().subscribe((resultEvent: any) => {
            if (resultEvent.type === HttpEventType.Response) {
                var res = resultEvent.body;
                this.quizUsers = res;
                this.result.updateInfo("Getting Users from this group...")
                this.http.getUsersForGroup(this.groupId).subscribe((resultEvent1: any) => {
                    if (resultEvent1.type === HttpEventType.Response) {
                        var res1 = resultEvent1.body;
                        this.checkedQuizUsers = res1;
                        this.setCheckedValues();
                    }
                });
            }
        })
    }

    constructor(private http: HTTPService, private route: ActivatedRoute, private router: Router) {
        this.result = new Result();
        this.quizUsers = [];
        this.checkedQuizUsers = [];
        this.checkedList = [];
        this.quizUserCheck = [];
    }

    onCheckboxChange(option: any, event: any) {
        var newCheckUser:any = [];
        this.quizUserCheck.forEach((el) => {
            if (el.QuizUserId === option.QuizUserId) {
                newCheckUser.push(new QuizUserCheck(el.QuizUserId, event.target.checked));
            }
            else {
                newCheckUser.push(new QuizUserCheck(el.QuizUserId, el.Checked));
            }
        });
        this.quizUserCheck = newCheckUser;
    }

    assign() {
        this.result.updateInfo("updating database...");
        var users: any = [];
        this.quizUserCheck.forEach((el) => {
            if (el.Checked) users.push(el.QuizUserId);
        })
        this.http.assignCustomUsersToGroup(users, this.groupId).subscribe((resultEvent: any) => {
            this.result.updateSuccess(true);
        })
    }

    setCheckedValues() {
        this.result.updateInfo("Updating view...")
        this.quizUsers.forEach((el) => {
            var foundObj: QuizUser = new QuizUser();
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
}