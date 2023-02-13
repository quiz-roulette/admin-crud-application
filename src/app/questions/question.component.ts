import { Component, OnInit } from '@angular/core';
import { HTTPService } from '../service/http.service';
import { QuestionWrapper } from '../model/questionWrapper';
import { AzureService } from '../service/azure.service';
import { Category } from '../model/category';
import { Result } from '../model/Result';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'question',
    templateUrl: 'question.component.html',
    styleUrls: ['question.component.css']
})

export class QuestionComponent implements OnInit {
    questionWrappers!: QuestionWrapper[];
    categories!: Category[];
    isTrue: boolean;
    selectedCategory!: string;
    result: Result;
    searchText: string;

    constructor(private httpService: HTTPService, private azureService: AzureService, private router: Router) {
        this.isTrue = true;
        this.result = new Result();
        this.searchText = "";
        $('#myModal').on('shown.bs.modal', function () {
            $('#myInput').trigger('focus')
        })
    }

    ngOnInit() {
        this.result.updateInfo("Getting questions...");
        this.getAllQuestions();


        this.selectedCategory = "simaa";
    }

    getAllQuestions() {
        this.result.updateInfo("Getting questions...");
        this.httpService.getAllQuestionWrapper().then((data) => {
            this.questionWrappers = data;
            this.result.updateSuccess(true);
        }).catch((err) => {
            this.result.updateError("Error!");
        });
    }

    addQuestion(text: any, imageurl: any, category: any, choice: any, correctchoice: any) {
        this.result.updateInfo("Adding question...");
        var questionWrapper = new QuestionWrapper();
        questionWrapper.Text = text;
        questionWrapper.setChoices(choice.split(";").map((item: any) => item.trim()));
        questionWrapper.CategoryName = this.selectedCategory;
        questionWrapper.ImageUrl = imageurl;
        var el = questionWrapper.choice.find((el) => el.Text == correctchoice);
        if (el) {
            questionWrapper.correctChoice = questionWrapper.choice.find((el) => el.Text == correctchoice)!;
            questionWrapper.correctChoiceText = correctchoice;
            this.httpService.addQuestionWrapper(questionWrapper).then((res) => {
                this.questionWrappers.push(res);
                this.result.updateTextSuccess("Added Question: " + questionWrapper.Text);
            }).catch((err) => {
                this.result.updateError("Error!");
            });
        }
        else
            this.result.updateError("Correct option not found the choices. Please ensure to use correct choice from the choices you wrote.");
    }
    deleteQuestion(questionId: any) {
        this.result.updateInfo("Deleting question...");
        this.httpService.deleteQuestion(questionId).subscribe((resultEvent: any) => {
            if (resultEvent.type === HttpEventType.Response) {
                var result = resultEvent.body;
                this.result.updateTextSuccess("Deleted Question");
            }
        })
    }

    updateResult(updatedResult: Result) {
        this.result = updatedResult;
    }

    addedQuestion(result: any) {
        this.getAllQuestions();
    }

    goToCategory() {
        this.router.navigate(['categories']);

    }
}