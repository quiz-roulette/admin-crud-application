import { Component, OnInit, OnDestroy } from '@angular/core';
import { Result } from '../../../model/Result';
import { QuizUser, QuizUserCheck } from '../../../model/QuizUser';
import { Group, GroupCheck } from '../../../model/Group';
import { HTTPService } from '../../../service/http.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
    selector: 'assign-group',
    templateUrl: 'assign-group.component.html',
    styleUrls: ['assign-group.component.css']
})



export class AssignGroupComponent implements OnInit, OnDestroy {
    groups: Group[];
    checkedGroupsForUser: Group[];
    checkedList: string[];
    userGroups: GroupCheck[];
    result: Result;
    private sub: Subscription;
    private quizUserId: string;

    ngOnInit() {
        // assign the subscription to a variable so we can unsubscribe to prevent memory leaks
        this.sub = this.route.params.subscribe((params: Params) => {
            this.quizUserId = params['quizuserid'];
        });

        this.result.updateInfo("Getting groups...")
        this.http.getAllGroups().then((res) => {
            this.groups = res;
            console.log(this.groups);
            this.result.updateInfo("Getting Users from this group...")
            this.http.getGroupsForUser(this.quizUserId).then((res1) => {
                
                this.checkedGroupsForUser = res1;
                console.log(this.checkedGroupsForUser)
                this.setCheckedValues();
            });
        });
    }

    constructor(private http: HTTPService, private route: ActivatedRoute, private router: Router) {
        this.result = new Result();
        this.groups = [];
        this.checkedGroupsForUser = [];
        this.checkedList = [];
        this.userGroups = [];
    }

    onCheckboxChange(option, event) {
        var newCheckUser = [];
        this.userGroups.forEach((el) => {
            if (el.Name === option.Name) {
                newCheckUser.push(new GroupCheck(el.Name,event.target.checked));
            }
            else{
                newCheckUser.push(new GroupCheck(el.Name,el.Checked));
            }
        });
        this.userGroups = newCheckUser;
    }

    assign(){
        this.result.updateInfo("updating database...");
        var groups = [];
        this.userGroups.forEach((el) => {
            if(el.Checked) groups.push(el.Name);
        })
        this.http.assignCustomGroupsToUser(groups,this.quizUserId).then((res) => {
            this.result.updateSuccess(true);
        });
    }

    setCheckedValues() {
        this.result.updateInfo("Updating view...")
        this.groups.forEach((el) => {
            var foundObj = null;
            this.checkedGroupsForUser.forEach((el1) => {
                if (el.Name === el1.Name) {
                    foundObj = el1;
                }
            });
            if (foundObj) this.userGroups.push(new GroupCheck(foundObj.Name, true));
            else this.userGroups.push(new GroupCheck(el.Name, false));
            console.log(this.userGroups);
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