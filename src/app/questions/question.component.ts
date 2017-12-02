import { Component, OnInit } from '@angular/core';
import { HTTPService } from '../service/http.service';
import { QuestionWrapper } from '../model/questionWrapper';
import { AzureService } from '../service/azure.service';
import { Category } from '../model/category';

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
    constructor(private httpService: HTTPService, private azureService: AzureService) { 
        this.isTrue = true;
    }

    ngOnInit() { 
        this.httpService.getAllQuestionWrapper().then((data) => {
            this.questionWrappers = data;
        })
        this.httpService.getAllCategories().then((data) => {
            this.categories = data;
            console.log(this.categories);
        })
        this.selectedCategory = "simaa";
    }

    addQuestion(text,category,choice,correctchoice )
    {
        var questionWrapper = new QuestionWrapper();
        questionWrapper.Text = text;
        questionWrapper.setChoices(choice.split(";").map((item) => item.trim()));// = ;
        questionWrapper.CategoryName = this.selectedCategory;
        var el = questionWrapper.choice.find((el) => el.text == correctchoice);
        if(el){
            questionWrapper.correctChoice = questionWrapper.choice.find((el) => el.text == correctchoice);
            questionWrapper.correctChoiceText = correctchoice;
            this.httpService.addQuestionWrapper(questionWrapper).then((res) => {
                this.questionWrappers.push(res);
                alert("Successfully Added");
            }).catch((err) => alert(err))
        }
        else
        alert("Correct option not found the choices. Please ensure to use correct choice from the choices you wrote.");
    }
    deleteQuestion(questionId){
        this.httpService.deleteQuestion(questionId).then((data) => {
            alert("Delete Succesfully");
        })
    }
}