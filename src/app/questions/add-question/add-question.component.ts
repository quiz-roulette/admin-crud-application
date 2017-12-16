import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Result } from '../../model/Result';
import { QuestionWrapper } from '../../model/questionWrapper';
import { HTTPService } from '../../service/http.service';
import { Category } from '../../model/category';


@Component({
    selector: 'add-question',
    templateUrl: 'add-question.component.html'
})

export class AddQuestionComponent implements OnInit {
    selectedCategory: string;
    result: Result;
    categories: Category[];
    @Output() addedQuestion =  new EventEmitter();
    
    constructor(private httpService:HTTPService) {
        this.result = new Result();

        this.httpService.getAllCategories().then((data) => {
            this.categories = data;
            console.log(this.categories);
        })
     }

    ngOnInit() { }

    addQuestion(text,imageurl, category,choice,correctchoice )
    {
        console.log(text,imageurl);
        this.result.updateInfo("Adding question...");
        var questionWrapper = new QuestionWrapper();
        questionWrapper.Text = text;
        questionWrapper.setChoices(choice.split(";").map((item) => item.trim()));// = ;
        questionWrapper.CategoryName = this.selectedCategory;
        questionWrapper.ImageUrl = imageurl;
        var el = questionWrapper.choice.find((el) => el.Text == correctchoice);
        if(el){
            questionWrapper.correctChoice = questionWrapper.choice.find((el) => el.Text == correctchoice);
            questionWrapper.correctChoiceText = correctchoice;
            this.httpService.addQuestionWrapper(questionWrapper).then((res) => {
                this.addedQuestion.emit("true");
                this.result.updateTextSuccess("Added Question: "+questionWrapper.Text);
            }).catch((err) => alert(err))
        }
        else
        this.result.updateError("Correct option not found the choices. Please ensure to use correct choice from the choices you wrote.");
    }

    updateResult(updatedResult: Result){
        this.result = updatedResult;
    }
}