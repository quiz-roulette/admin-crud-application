import { Component, OnInit } from '@angular/core';
import { HTTPService } from '../../service/http.service';
import { Router } from "@angular/router";
import { QuizUser } from '../../model/QuizUser';
import { Result } from '../../model/Result';
import { Group } from '../../model/Group';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'dashboard',
    templateUrl: 'user.component.html',
    styleUrls: ['user.component.css']
})

export class UserComponent implements OnInit {
    quizUsers!: QuizUser[];
    newQuizUser!: QuizUser;
    groups!: Group[];
    selectedGroup!: string;
    result!: Result;

    constructor(private httpService: HTTPService, private router: Router) { }

    ngOnInit() {
        this.newQuizUser = new QuizUser();
        this.result = new Result();
        this.getAllUsers();

        this.httpService.getAllGroups().subscribe((resultEvent: any) => {
            console.log("get all groups ... ", resultEvent)
            if (resultEvent.type === HttpEventType.Response) {
                var res = resultEvent.body;
                this.groups = res;
            }
        });
    }

    getAllUsers() {
        this.result.updateInfo("Getting Users...")
        this.httpService.getAllQuizUsers().then((resultEvent: any) => {
            console.log("get all quiz users ... ", resultEvent)
            if (resultEvent.type === HttpEventType.Response) {
                var result = resultEvent.body;
                this.quizUsers = result;
                this.result.updateSuccess(true);
            }
        })
    }

    addUser() {
        this.result.updateInfo("Adding User...");
        // console.log(this.selectedGroup);
        if (this.selectedGroup != null && this.newQuizUser.QuizUserId != null && this.newQuizUser.Password != null) {
            this.httpService.addUser(this.newQuizUser).subscribe((resultEvent: any) => {
                console.log("add quiz user ... ", resultEvent)
                if (resultEvent.type === HttpEventType.Response) {
                    var result = resultEvent.body;
                    this.quizUsers.push(this.newQuizUser);

                    this.httpService.assignUserToGroup(this.selectedGroup, this.newQuizUser.QuizUserId).subscribe((resultEvent1: any) => {
                        console.log("assign User To... ", resultEvent)
                        if (resultEvent.type === HttpEventType.Response) {
                            var result = resultEvent.body;
                            this.result.updateSuccess(true);
                            this.newQuizUser = new QuizUser();
                        }
                    })

                }
            })
        }
        else {
            if (this.selectedGroup != null) {
                this.result.updateError("Must Select a group");
            }
            if (this.newQuizUser.QuizUserId != null) {
                this.result.updateError("Username cannot be empty");
            }
            if (this.newQuizUser.Password != null) {
                this.result.updateError("Password cannot be empty");
            }
        }
    }

    deleteUser(id: any) {
        if (id == localStorage.getItem('user')) {
            this.result.updateError("You cannot delete yourself");
        }
        else {
            this.result.updateInfo("Deleting User...");
            this.httpService.deleteUser(id).subscribe((resultEvent: any) => {
                console.log("assign User To... ", resultEvent)
                if (resultEvent.type === HttpEventType.Response) {
                    var result = resultEvent.body;
                    this.result.updateTextSuccess("Deleted User Successfully");
                    this.getAllUsers();
                }
            })
        }
    }

    assignGroups(userid: any) {
        this.router.navigate(['/assign-groups', userid]);
    }

    updateResult(result: Result) {
        this.result = result;
    }

    goToGroup() {
        this.router.navigate(['groups']);
    }
}