import { Component, OnInit } from '@angular/core';
import { HTTPService } from '../../service/http.service';
import {Router} from "@angular/router";
import { QuizUser } from '../../model/QuizUser';
import { Result } from '../../model/Result';

@Component({
    selector: 'users',
    templateUrl: 'user.component.html',
    styleUrls: ['user.component.css']
})

export class UserComponent implements OnInit {
    quizUsers: QuizUser[];
    newQuizUser: QuizUser;
    result: Result;

    constructor(private httpService: HTTPService,private router: Router) { }

    ngOnInit() {
        this.newQuizUser = new QuizUser();
        this.result = new Result();
        this.getAllUsers();
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
        this.httpService.addUser(this.newQuizUser).then((result) => {
            if (result) {
                this.quizUsers.push(this.newQuizUser);
                this.httpService.assignGroupsToUser(this.newQuizUser.QuizUserId).then((res) => {
                    console.log("Successfully added all groups to the user");
                    this.newQuizUser = new QuizUser();
                    this.result.updateSuccess(true);
                })
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

    assignGroups(userid){
        this.router.navigate(['/assign-groups', userid]);
    }

    updateResult(result: Result) {
        this.result = result;
    }
}