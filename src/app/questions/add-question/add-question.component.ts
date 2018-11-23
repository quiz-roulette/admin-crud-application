import { Component, OnInit, Output, EventEmitter, SystemJsNgModuleLoader } from '@angular/core'
import { Result } from '../../model/Result'
import { QuestionWrapper } from '../../model/questionWrapper'
import { HTTPService } from '../../service/http.service'
import { Category } from '../../model/category'


@Component({
    selector: 'add-question',
    templateUrl: 'add-question.component.html'
})

export class AddQuestionComponent implements OnInit {
    selectedCategory: string;
    result: Result;
    categories: Category[];
    @Output() addedQuestion = new EventEmitter();

    constructor(private httpService: HTTPService) {
        this.result = new Result();

        this.httpService.getAllCategories().then((data) => {
            this.categories = data;
            // console.log(this.categories);
        }).catch((err) => {
            this.result.updateError("Error!");
        });

    }

    ngOnInit() { }

    addQuestion(text, imageurl, category, choice, correctchoice) {
        // console.log(text,imageurl);
        this.result.updateInfo("Adding question...");
        var questionWrapper = new QuestionWrapper();
        questionWrapper.Text = text.trim();
        questionWrapper.setChoices(choice.split(";").map((item) => item.trim()));// = ;
        questionWrapper.CategoryName = this.selectedCategory;
        questionWrapper.ImageUrl = imageurl;
        var el = questionWrapper.choice.find((el) => el.Text == correctchoice);
        if (el) {
            questionWrapper.correctChoice = questionWrapper.choice.find((el) => el.Text == correctchoice);
            questionWrapper.correctChoiceText = correctchoice;
            console.log(questionWrapper)
            this.httpService.addQuestionWrapper(questionWrapper).then((res) => {
                this.addedQuestion.emit("true");
                this.result.updateTextSuccess("Added Question: " + questionWrapper.Text);
            }).catch((err) => alert(err))
        }
        else
            this.result.updateError("Correct option not found the choices. Please ensure to use correct choice from the choices you wrote.");
    }

    addUpdateQuestion() {
        // throw "error";

        var bigtext = `OS computer abbreviation usually means ?[;]Order of Significance;Open Software;Operating System;Optical Sensor;[;]Operating System
        Which of these is not an OS[;]Windows;Ubuntu;Oracle;MacOs;[;]Oracle
        What format is a Microsoft Word document saved in?[;]docx;xsl;csv;ppt;[;]docx
        What is the most popular OS used on smartphones?[;]Windows OS;iOS;Google Android;PalmOs;[;]Google Android
        Who is known as the father of computers?[;]Alan Turing;Charles Babbage;Bill Gates;Steve Jobs;[;]Charles Babbage
        Which year was the first generation of  iPhone launched?[;]2007;2005;2006;2008[;]2007
        What is Google?[;]Search Engine;News Aggregator;Social Network;OS;[;]Search Engine
        Which programming language is used to buld websites?[;]Pascal;HTML;C#;C++;[;]HTML
        Who is the current(2018) CEO of Microsoft?[;]Tim Cook;Satya Nadella;Bill Gates;Sundar Pichai;[;]Satya Nadella
        Who is the current(2018) CEO of Apple?[;]Tim Cook;Satya Nadella;Steve Jobs;Sundar Pichai;[;]Tim Cook
        What is GPS stand for? [;]Global Positioning System;Grid Pixel System;Global Pressure Sound;Generic Photographic Symbol;[;]Global Positioning System
        Which of the following is Video on-demand service?[;]Google;Netflix;Spotify;[;]Netflix
        What does "LCD" stand for?[;]Language Control Design;Last Common Difference;Long Continuous Design;Liquid Crystal Display;[;]Liquid Crystal Display
        MacOS is based on Linux,[;]True;False;[;]True
        What does GHz stand for?[;]Gigahotz;Gigahetz;Gigahatz;Gigahertz;[;]Gigahertz
        Which company made the first Android phone?[;]HTC;Samsung;LG;Huawei[;]HTC
        Which programming language shares its name with an island in Indonesia?[;]Python;Laval;Jakarta;Java;[;]Java
        Who created the worlds first 64bit processor?[;] Intel;AMD;Nvidia;Microsoft[;]AMD
        On which day did the World Wide Web go online?[;]December 17, 1996;November 12, 1990;November 24, 1995;December 20, 1990;[;]December 20, 1990
        Moore's law originally stated that the number of transistors on a microprocessor chip would double every..?[;]Four Years;Two Years;Eight Years;One Year;[;]One Year`;

        try {
            this.selectedCategory = "O Level Quiz"
            if (!this.selectedCategory || this.selectedCategory == "") throw "Category Cannot be null or empty"
            console.log(this.selectedCategory)
            var textarray = bigtext.split('\n');
            console.log(textarray.length)
            var promises = [];
            var questionwappers = [];
            textarray.forEach(ele => {
                console.log(ele);
                var element = ele.split('[;]');
                if (element.length == 3) {
                    var text = element[0].trim();
                    var choice = element[1];
                    var correctchoice = element[2];
                    //this.addQuestion(element[0],null,'Computer',element[1],element[2]);
                    var questionWrapper = new QuestionWrapper();
                    questionWrapper.Text = text.trim();
                    questionWrapper.setChoices(choice.split(";").map((item) => item.trim()));// = ;
                    questionWrapper.CategoryName = this.selectedCategory;
                    questionWrapper.ImageUrl = null;
                    var el = questionWrapper.choice.find((el) => el.Text == correctchoice);
                    if (el) {
                        questionWrapper.correctChoice = questionWrapper.choice.find((el) => el.Text == correctchoice);
                        questionWrapper.correctChoiceText = correctchoice;
                        questionwappers.push(questionWrapper);
                    }
                    else {
                        throw "The option does not seem to match correct option"
                    }
                }
            });

            console.log(questionwappers.length);
            console.log(questionwappers);

            questionwappers.forEach((el) => {
                promises.push(this.httpService.addQuestionWrapper(el));
            })

            Promise.all(promises).then((res) => {
                this.result.updateTextSuccess("All went okay!");
            })
        } catch (error) {
            this.result.updateError(error);
        }
    }

    updateResult(updatedResult: Result) {
        this.result = updatedResult;
    }
}