import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions,Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { QuestionWrapper } from '../model/questionWrapper';
import { Question } from '../model/question';
import { Choice } from '../model/choice';
import { CorrectChoice } from '../model/CorrectChoice';

@Injectable()
export class HTTPService {
    private AzureUrl = "https://arck9app.azurewebsites.net";
    options: any;

    constructor(private http: Http) { 
        this.options = new RequestOptions({ headers: new Headers({ 'ZUMO-API-VERSION': '2.0.0' }) });
    }

    getAllQuestions(){
        return this.http.get(`${this.AzureUrl}/tables/question`,this.options).toPromise().then(this.extractData);
    }

    getAllChoices(){
        return this.http.get(`${this.AzureUrl}/tables/choice`,this.options).toPromise().then(this.extractData);
    }

    getAllCorrectChoices(){
        return this.http.get(`${this.AzureUrl}/tables/correctChoice`,this.options).toPromise().then(this.extractData);
    }

    getAllQuestionWrapper(): Promise<QuestionWrapper[]>  {
        var current = this;
        var questionWrappers = new Array<QuestionWrapper>();
        var questions: Question[];
        var choices: Choice[];
        var correctChoices: CorrectChoice[];

        return new Promise((resolve, reject) => {
            let promises = new Array<Promise<any>>();

            let promise = current.getAllQuestions()
            .then(data => questions = data)
            .catch(this.handleError);

            promises.push(promise);

            promise = current.getAllChoices()
            .then(data => {
                choices = data;
            })
            .catch(this.handleError);

            promises.push(promise);

            promise = current.getAllCorrectChoices()
            .then(data => correctChoices = data)
            .catch(this.handleError);

            promises.push(promise);

            Promise.all(promises).then(function () {
                questions.forEach(element => {
                    var questionWrapper: QuestionWrapper = new QuestionWrapper();
                    questionWrapper.questionId = element.questionId;
                    questionWrapper.text = element.text;
                    questionWrapper.categoryId = element.categoryId;
                    questionWrapper.choice = choices.filter((el) => el.questionId == element.questionId);
                    questionWrapper.correctChoice = correctChoices.find((el) => el.questionId == questionWrapper.questionId);
                    questionWrappers.push(questionWrapper);
                });
                resolve(questionWrappers);
            });
        });

    }

    addQuestionWrapper(questionWrapper: QuestionWrapper): Promise<QuestionWrapper> 
    {
        return new Promise((resolve, reject) => {
            try {
                this.addQuestion(questionWrapper.text,questionWrapper.categoryId).then((question) => {
                    questionWrapper.questionId = question.questionId;
                    let promises = new Array<Promise<any>>();
                    questionWrapper.choice.forEach((element) => {
                        let promise = this.addChoice(questionWrapper.questionId,element.text).then((choice) => {
                            element.choiceId = choice.choiceId;
                        })
                        promises.push(promise);
                    })
                    Promise.all(promises).then((result) => {
                        questionWrapper.choice.forEach((element) => {
                           if(element.text == questionWrapper.correctChoiceText){
                               this.addCorrectChoice(questionWrapper.questionId,element.choiceId).then((res) => {
                                    questionWrapper.correctChoice.choiceId = element.choiceId;
                                    questionWrapper.correctChoice.questionId = questionWrapper.questionId;
                                    resolve(questionWrapper);
                               })
                           }
                        });
                    })
                })
            } catch (error) {
                throw error;
            }
            
        });
    }


    addQuestion(text, category){
        return this.http.post(`${this.AzureUrl}/api/question`,{ text: text, categoryId: category},this.options).toPromise().then(this.extractData);
    }

    addChoice(questionId, text){
        return this.http.post(`${this.AzureUrl}/api/choice`,{ text: text, questionId: questionId},this.options).toPromise().then(this.extractData);
    }

    addCorrectChoice(questionId, choiceId){
        return this.http.post(`${this.AzureUrl}/api/correctChoice`,{ questionId: questionId, choiceId: choiceId},this.options).toPromise().then(this.extractData);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
    
}