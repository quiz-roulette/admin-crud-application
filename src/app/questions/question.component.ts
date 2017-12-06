import { Component, OnInit } from '@angular/core';
import { HTTPService } from '../service/http.service';
import { QuestionWrapper } from '../model/questionWrapper';
import { AzureService } from '../service/azure.service';
import { Category } from '../model/category';
import { Result } from '../model/Result';

@Component({
    selector: 'question',
    templateUrl: 'question.component.html',
    styleUrls:['question.component.css']
})

export class QuestionComponent implements OnInit {
    questionWrappers: QuestionWrapper[];
    categories: Category[];
    isTrue: boolean;
    selectedCategory: string;
    result: Result;

    constructor(private httpService: HTTPService, private azureService: AzureService) { 
        this.isTrue = true;
        this.result = new Result();
    }

    ngOnInit() { 
        this.result.updateInfo("Getting questions...");
        this.httpService.getAllQuestionWrapper().then((data) => {
            this.questionWrappers = data;
            this.result.updateSuccess(true);
        })

        this.httpService.getAllCategories().then((data) => {
            this.categories = data;
            console.log(this.categories);
        })
        this.selectedCategory = "simaa";
    }

    addQuestion(text,category,choice,correctchoice )
    {
        this.result.updateInfo("Adding question...");
        var questionWrapper = new QuestionWrapper();
        questionWrapper.Text = text;
        questionWrapper.setChoices(choice.split(";").map((item) => item.trim()));// = ;
        questionWrapper.CategoryName = this.selectedCategory;
        var el = questionWrapper.choice.find((el) => el.Text == correctchoice);
        if(el){
            questionWrapper.correctChoice = questionWrapper.choice.find((el) => el.Text == correctchoice);
            questionWrapper.correctChoiceText = correctchoice;
            this.httpService.addQuestionWrapper(questionWrapper).then((res) => {
                this.questionWrappers.push(res);
                this.result.updateTextSuccess("Added Question: "+questionWrapper.Text);
            }).catch((err) => alert(err))
        }
        else
        this.result.updateError("Correct option not found the choices. Please ensure to use correct choice from the choices you wrote.");
    }
    deleteQuestion(questionId){
        this.result.updateInfo("Deleting question...");
        this.httpService.deleteQuestion(questionId).then((data) => {
            this.result.updateTextSuccess("Deleted Question");
        })
    }
}