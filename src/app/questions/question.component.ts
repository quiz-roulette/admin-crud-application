import { Component, OnInit } from '@angular/core';
import { HTTPService } from '../service/http.service';
import { QuestionWrapper } from '../model/questionWrapper';
import { Category } from '../model/category';
import { Result } from '../model/Result';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { data } from 'jquery';
import { forkJoin } from 'rxjs';

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

    constructor(private httpService: HTTPService, private router: Router) {
        this.isTrue = true;
        this.result = new Result();
        this.searchText = "";
        $('#myModal').on('shown.bs.modal', function () {
            $('#myInput').trigger('focus')
        })
    }

    ngOnInit() {
        console.log("gonna get questions")
        this.result.updateInfo("Getting questions...");
        this.getAllQuestions();


        this.selectedCategory = "simaa";
    }

    getAllQuestions() {
        this.result.updateInfo("Getting questions...");

        let questionWrappers = new Array<QuestionWrapper>();

        forkJoin([this.httpService.getAllQuestions(), this.httpService.getAllChoices(), this.httpService.getAllCorrectChoices()]).subscribe(([
            questionsEvent, choicesEvent, correctChoicesEvent
        ]) => {

            var questions = <any>questionsEvent;
            var choices = <any>choicesEvent;
            var correctChoices = <any>correctChoicesEvent;
            console.log(questions);
            console.log(choices);
            console.log(correctChoices);

            questions.forEach((element: any) => {
                let questionWrapper = new QuestionWrapper();
                questionWrapper.QuestionId = element.QuestionId;
                questionWrapper.Text = element.Text;
                questionWrapper.CategoryName = element.CategoryName;
                questionWrapper.ImageUrl = element.ImageUrl;
                questionWrapper.choice = choices.filter((el: any) => el.QuestionId == element.QuestionId);
                questionWrapper.correctChoice = correctChoices.find((el: any) => el.QuestionId == questionWrapper.QuestionId);
                if(questionWrapper.correctChoice != undefined)  {
                    questionWrappers.push(questionWrapper);
                }
                
            });

            console.log(questionWrappers)

            this.questionWrappers = questionWrappers;
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