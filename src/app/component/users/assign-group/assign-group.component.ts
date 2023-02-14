import { Component, OnInit, OnDestroy } from '@angular/core';
import { Result } from '../../../model/Result';
import { QuizUser, QuizUserCheck } from '../../../model/QuizUser';
import { Group, GroupCheck } from '../../../model/Group';
import { HTTPService } from '../../../service/http.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'assign-group',
    templateUrl: 'assign-group.component.html',
    styleUrls: ['assign-group.component.css']
})



export class AssignGroupComponent implements OnInit {
    groups: Group[];
    checkedGroupsForUser: Group[];
    checkedList: string[];
    userGroups: GroupCheck[];
    result: Result;
    public quizUserId!: string;

    ngOnInit() {
        this.quizUserId = this.route.snapshot.paramMap.get("quizuserid")!

        this.result.updateInfo("Getting groups...")
        this.http.getAllGroups().subscribe((resultEvent: any) => {
            console.log("getting all quiz.. ", resultEvent)
            if (resultEvent.type === HttpEventType.Response) {
                var res = resultEvent.body;

                this.groups = res;
                // console.log(this.groups);
                this.result.updateInfo("Getting Users from this group...")
                this.http.getGroupsForUser(this.quizUserId).subscribe((resultEvent1: any) => {
                    console.log("getting all quiz.. ", resultEvent)
                    if (resultEvent1.type === HttpEventType.Response) {
                        var res1 = resultEvent1.body;
                        this.checkedGroupsForUser = res1;
                        // console.log(this.checkedGroupsForUser)
                        this.setCheckedValues();
                    }
                });
            }
        });
    }

    constructor(private http: HTTPService, private route: ActivatedRoute, private router: Router) {
        this.result = new Result();
        this.groups = [];
        this.checkedGroupsForUser = [];
        this.checkedList = [];
        this.userGroups = [];
    }

    onCheckboxChange(option: any, event: any) {
        var newCheckUser: any = [];
        this.userGroups.forEach((el) => {
            if (el.Name === option.Name) {
                newCheckUser.push(new GroupCheck(el.Name, event.target.checked));
            }
            else {
                newCheckUser.push(new GroupCheck(el.Name, el.Checked));
            }
        });
        this.userGroups = newCheckUser;
    }

    assign() {
        this.result.updateInfo("updating database...");
        var groups: Group[] = [];
        this.userGroups.forEach((el: any) => {
            if (el.Checked) groups.push(el.Name);
        })
        this.http.assignCustomGroupsToUser(groups, this.quizUserId).subscribe((resultEvent: any) => {
            console.log("assigning custom groups to users.. ", resultEvent)
            if (resultEvent.type === HttpEventType.Response) {
                var data = resultEvent.body;
                this.result.updateSuccess(true);
            }
        })
    }

    setCheckedValues() {
        this.result.updateInfo("Updating view...")
        this.groups.forEach((el) => {
            var foundObj: Group = new Group();
            this.checkedGroupsForUser.forEach((el1) => {
                if (el.Name === el1.Name) {
                    foundObj = el1;
                }
            });
            if (foundObj) this.userGroups.push(new GroupCheck(foundObj.Name, true));
            else this.userGroups.push(new GroupCheck(el.Name, false));
            // console.log(this.userGroups);
        });
        this.result.updateSuccess(true);
    }

    updateResult(result: Result) {
        this.result = result;
    }
}