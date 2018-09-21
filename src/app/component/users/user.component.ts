import { Component, OnInit } from '@angular/core';
import { HTTPService } from '../../service/http.service';
import { Router } from "@angular/router";
import { QuizUser } from '../../model/QuizUser';
import { Result } from '../../model/Result';
import { Group } from '../../model/Group';

@Component({
    selector: 'users',
    templateUrl: 'user.component.html',
    styleUrls: ['user.component.css']
})

export class UserComponent implements OnInit {
    quizUsers: QuizUser[];
    newQuizUser: QuizUser;
    groups: Group[];
    selectedGroup: string;
    result: Result;

    constructor(private httpService: HTTPService, private router: Router) { }

    ngOnInit() {
        this.newQuizUser = new QuizUser();
        this.result = new Result();
        this.getAllUsers();

        this.httpService.getAllGroups().then((res) => {
            this.groups = res;
            console.log(this.groups);
        });
    }

    getAllUsers() {
        this.result.updateInfo("Getting Users...")
        this.httpService.getAllQuizUsers().then((result) => {
            this.quizUsers = result;
            this.result.updateSuccess(true);
        })
    }

    addUser() {
        this.result.updateInfo("Adding User...");
        console.log(this.selectedGroup);
        this.httpService.addUser(this.newQuizUser).then((result) => {
            if (result) {
                this.quizUsers.push(this.newQuizUser);
                
                this.httpService.assignUserToGroup(this.selectedGroup,this.newQuizUser.QuizUserId).then((res) => {
                    this.result.updateSuccess(true);
                    this.newQuizUser = new QuizUser();
                })
                // this.httpService.assignGroupsToUser(this.newQuizUser.QuizUserId).then((res) => {
                //     console.log("Successfully added all groups to the user");

                // })
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    deleteUser(id) {
        if (id == localStorage.getItem('user')) {
            this.result.updateError("You cannot delete yourself");
        }
        else {
            this.result.updateInfo("Deleting User...");
            this.httpService.deleteUser(id).then((result) => {
                if (result) {
                    this.result.updateTextSuccess("Deleted User Successfully");
                    this.getAllUsers();
                }
            })
        }
    }

    assignGroups(userid) {
        this.router.navigate(['/assign-groups', userid]);
    }

    updateResult(result: Result) {
        this.result = result;
    }

    goToGroup(){
        this.router.navigate(['groups']);
    }
}