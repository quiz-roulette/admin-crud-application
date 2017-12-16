import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Result } from '../model/Result';
import { QuizUser } from '../model/QuizUser';
import { HTTPService } from '../service/http.service';

@Component({
    moduleId: module.id,
    selector: 'authentication',
    templateUrl: 'authentication.component.html',
    styleUrls: ['authentication.component.css']
})

export class AuthenticationComponent implements OnInit {
    tab: string;
    result: Result;
    quizUser: QuizUser;
    tandc: any = { checked: false};

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute, 
        private httpService: HTTPService) {
        this.init();
    }

    init() {
        this.tab = 'login';
        this.result = new Result();
        this.quizUser = new QuizUser();

        this.activatedRoute.params.subscribe((params: Params) => {
            if (params['tab']) this.tab = params['tab'];
        });
    }
    ngOnInit() { 
        if(localStorage.getItem('user')){
            this.router.navigateByUrl('/questions');
        }
    }

    signup() {
    }

    login() {
        this.result.updateInfo("Logging in..")
        this.httpService.Login(this.quizUser.QuizUserId, this.quizUser.Password).then(result => {
            if (result == true) {
                    localStorage.setItem('user',this.quizUser.QuizUserId);
                    this.result.updateSuccess(true);
                    this.router.navigateByUrl('/questions');
            }
        }, error => this.result.updateError("Authentication Failed")).catch(err => this.result.updateError("Authentication Failed"));
    }

    updateResult(result) {
        this.result = result;
    }
}