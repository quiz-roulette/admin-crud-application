import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { QuestionWrapper } from '../model/questionWrapper';
import { Question } from '../model/question';
import { Choice } from '../model/choice';
import { CorrectChoice } from '../model/CorrectChoice';
import { QuizUser } from '../model/QuizUser';
import { Category } from '../model/category';

@Injectable()
export class HTTPService {
    private AzureUrl = "https://axperienceapp.azurewebsites.net";
    options: any;





    Login(quizUserId, password): any {
        return this.http.get(`${this.AzureUrl}/api/authenticate?userId=${quizUserId}&userPassword=${password}&isAdmin=${true}`, this.options).toPromise().then(this.extractData);
    }

    getAllQuizUsers(): any {
        return this.http.get(`${this.AzureUrl}/api/quizuser`, this.options).toPromise().then(this.extractData);
    }


    constructor(private http: Http) {
        this.options = new RequestOptions({ headers: new Headers({ 'ZUMO-API-VERSION': '2.0.0', 'authorization': localStorage.getItem('user') }) });
    }

    /**
     * returns all the questions from the database
     */
    getAllQuestions() {
        return this.http.get(`${this.AzureUrl}/api/question`, this.options).toPromise().then(this.extractData);
    }

    /**
     * returns all the choices from the database
     */
    getAllChoices() {
        return this.http.get(`${this.AzureUrl}/api/choice`, this.options).toPromise().then(this.extractData);
    }

    /**
     * returns all the correctChoices from the database
     */
    getAllCorrectChoices() {
        return this.http.get(`${this.AzureUrl}/api/correctChoice`, this.options).toPromise().then(this.extractData);
    }

    getAllCategories() {
        return this.http.get(`${this.AzureUrl}/api/category`, this.options).toPromise().then(this.extractData);
    }

    /**
     * Returns questionWrapper that consisits of Question,Choices and CorrectChoice.
     */
    getAllQuestionWrapper(): Promise<QuestionWrapper[]> {
        var current = this;
        var questionWrappers = new Array<QuestionWrapper>();
        var questions = new Array<Question>()
        var choices = new Array<Choice>();
        var correctChoices = new Array<CorrectChoice>();

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
                try {
                    questions.forEach(element => {
                        // console.log(element);
                        var questionWrapper: QuestionWrapper = new QuestionWrapper();
                        questionWrapper.QuestionId = element.QuestionId;
                        questionWrapper.Text = element.Text;
                        questionWrapper.CategoryName = element.CategoryName;
                        questionWrapper.ImageUrl = element.ImageUrl;
                        questionWrapper.choice = choices.filter((el) => el.QuestionId == element.QuestionId);
                        questionWrapper.correctChoice = correctChoices.find((el) => el.QuestionId == questionWrapper.QuestionId);
                        questionWrappers.push(questionWrapper);
                    });
                    resolve(questionWrappers);
                } catch (error) {
                    resolve(questionWrappers);
                }
            });
        });

    }

    /**
     * 
     * @param questionWrapper Adds a new wrapper to the database
     * layer 1: Adds question to the database
     * layer 2: It loops for the choices(because there has to be more than 1 choice) and add one by one to the database
     * layer 3: It get the choiceId of the correctChoice and add that to the database.
     */
    addQuestionWrapper(questionWrapper: QuestionWrapper): Promise<QuestionWrapper> {
        return new Promise((resolve, reject) => {
            try {
                if (questionWrapper.Text != "" && questionWrapper.choice.length > 1) {
                    this.addQuestion(questionWrapper.Text, questionWrapper.CategoryName, questionWrapper.ImageUrl).then((question) => {
                        // console.log(question);
                        questionWrapper.QuestionId = question.QuestionId;
                        let promises = new Array<Promise<any>>();
                        questionWrapper.choice.forEach((element) => {
                            if (element.Text.trim() != "") {
                                let promise = this.addChoice(questionWrapper.QuestionId, element.Text).then((choice) => {
                                    element.ChoiceId = choice.ChoiceId;
                                })
                                promises.push(promise);
                            }
                        })
                        Promise.all(promises).then((result) => {
                            questionWrapper.choice.forEach((element) => {
                                if (element.Text == questionWrapper.correctChoiceText) {
                                    // console.log(questionWrapper.QuestionId, element.ChoiceId);
                                    this.addCorrectChoice(questionWrapper.QuestionId, element.ChoiceId).then((res) => {
                                        questionWrapper.correctChoice.ChoiceId = element.ChoiceId;
                                        questionWrapper.correctChoice.QuestionId = questionWrapper.QuestionId;
                                        resolve(questionWrapper);
                                    }).catch((err) => {
                                        this.deleteQuestion(question.QuestionId);
                                        reject("Correct Choice Adding Failed");
                                    });
                                }
                            })
                        }).catch((err) => {
                            this.deleteQuestion(question.QuestionId);
                            reject("Choice Adding Failed");
                        });
                    }).catch((err) => {

                    })
                }
                else throw new Error("Question Text or Choice cannot be empty.");
            } catch (error) {
                throw error;
            }

        });
    }

    /**
     * 
     * @param text 
     * @param category 
     * it adds the text and category to the database
     */
    addQuestion(text, category, imageUrl) {
        return this.http.post(`${this.AzureUrl}/api/question`, { Text: text, CategoryName: category, ImageUrl: imageUrl }, this.options).toPromise().then(this.extractData);
    }

    addChoice(questionId, text) {
        return this.http.post(`${this.AzureUrl}/api/choice`, { Text: text, QuestionId: questionId }, this.options).toPromise().then(this.extractData);
    }

    addUser(user: QuizUser) {
        return this.http.post(`${this.AzureUrl}/api/quizuser`, user, this.options).toPromise().then(this.extractData);
    }

    addCategory(category: Category): any {
        return this.http.post(`${this.AzureUrl}/api/category`, category, this.options).toPromise().then(this.extractData);
    }

    assignUserToGroup(groupname, userid) {
        // console.log({ GName: groupname, UserId: userid });
        return this.http.post(`${this.AzureUrl}/api/quizusergroup_join`, { GName: groupname, UserId: userid }, this.options).toPromise().then(this.extractData);
    }

    getUsersForGroup(gname) {
        return this.http.get(`${this.AzureUrl}/api/quizusergroup_join?groupName=` + gname, this.options).toPromise().then(this.extractData);
    }

    getGroupsForUser(quizUserId){
        return this.http.get(`${this.AzureUrl}/api/quizusergroup_join?quizUserId=` + quizUserId, this.options).toPromise().then(this.extractData);
    }

    assignCustomUsersToGroup(arg0: any, arg1: any): any {
        // console.log("A");
        return new Promise((resolve, reject) => {
            // console.log("B");
            this.deleteAllUsersForGroup(arg1).then((res) => {
                // console.log("C");
                var promises = [];
                arg0.forEach(element => {
                    promises.push(this.assignUserToGroup(arg1, element));
                });
                // console.log("D");
                Promise.all(promises).then((res) => {
                    // console.log("E");
                    resolve();
                }).catch((err) => reject());
            }).catch((err) => reject());
        });
    }

    assignCustomGroupsToUser(arg0: any, arg1: any): any {
        return new Promise((resolve, reject) => {
            this.deleteAllGroupsForUser(arg1).then((res) => {
                var promises = [];
                arg0.forEach(element => {
                    promises.push(this.assignUserToGroup(element,arg1));
                });
                Promise.all(promises).then((res) => {
                    // console.log("E");
                    resolve();
                }).catch((err) => reject());
            }).catch((err) => reject());
        });
    }

    deleteAllUsersForGroup(gname) {
        return this.http.delete(`${this.AzureUrl}/api/quizusergroup_join?groupName=` + gname, this.options).toPromise().then(this.extractData);
    }

    deleteAllGroupsForUser(userid){
        return this.http.delete(`${this.AzureUrl}/api/quizusergroup_join?quizUserId=` + userid, this.options).toPromise().then(this.extractData);
    }

    getAllUserGroupNames() {
        return this.http.get(`${this.AzureUrl}/api/group`, this.options).toPromise().then(this.extractData);
    }

    getAllGroups() {
        return this.getAllUserGroupNames();
    }

    addGroup(group) {
        return this.http.post(`${this.AzureUrl}/api/group`, group, this.options).toPromise().then(this.extractData);
    }

    deleteGroup(name) {
        return this.http.delete(`${this.AzureUrl}/api/group?groupname=${name}`, this.options).toPromise().then(this.extractData);
    }

    assignUsersToGroup(groupname) {
        var promises = [];
        return new Promise((resolve, reject) => {
            this.getAllQuizUsers().then((res) => {
                var users = res;
                // console.log(users);
                users.forEach(element => {
                    var promise = this.assignUserToGroup(groupname, element.QuizUserId);
                    promises.push(promise);
                });
                Promise.all(promises).then((res) => {
                    resolve();
                }).catch((err) => {
                    // console.log(err);
                    reject();
                })
            }).catch((err) => {
                // console.log(err);
                reject();
            });
        })
    }

    assignGroupsToUser(userId) {
        var promises = [];
        return new Promise((resolve, reject) => {
            this.getAllGroups().then((res) => {
                var groupnames = res;
                // console.log(groupnames);
                groupnames.forEach(element => {
                    var promise = this.assignUserToGroup(element.Name, userId);
                    promises.push(promise);
                });
                Promise.all(promises).then((res) => {
                    resolve();
                }).catch((err) => {
                    reject();
                })
            }).catch((err) => reject());
        });
    }

    /**
     * 
     * @param questionId of which the correct choice is being entered.
     * @param choiceId of which the correct question is being entered.
     */
    addCorrectChoice(questionId, choiceId) {
        return this.http.post(`${this.AzureUrl}/api/correctChoice`, { QuestionId: questionId, ChoiceId: choiceId }, this.options).toPromise().then(this.extractData);
    }

    /**
     * 
     * @param questionId the question id that needs to be deleted.
     * It called a HTTP patch method, that contains a JSON object with attributes { questionId: 0, isDelete: true}.
     * @example httpService.deleteQuestion(1).then((data) => { // console.log("deleted Succesfully")});
     */
    deleteQuestion(questionId) {
        return this.http.patch(`${this.AzureUrl}/api/question`, { QuestionId: questionId, IsDelete: true }, this.options).toPromise().then(this.extractData);
    }

    deleteUser(userId) {
        return this.http.delete(`${this.AzureUrl}/api/quizUser?QuizUserId=${userId}`, this.options).toPromise().then(this.extractData);
    }

    deleteCategory(categoryName: any): any {
        return this.http.delete(`${this.AzureUrl}/api/category?CategoryName=${categoryName}`, this.options).toPromise().then(this.extractData);
    }

    addQuiz(quiz):any{
        return this.http.post(`${this.AzureUrl}/api/quiz`,quiz,this.options).toPromise().then(this.extractData);
    }

    getAllQuiz():any{
        return this.http.get(`${this.AzureUrl}/api/quiz`,this.options).toPromise().then(this.extractData);
    }

    endQuiz(id): any{
        var newObj = { QuizId: id, HasEnded: true, EndDateTime: new Date() };
        return this.http.patch(`${this.AzureUrl}/api/quiz`,newObj,this.options).toPromise().then(this.extractData);
    }

    addOneTimeQuiz(quiz):any{
        return this.http.post(`${this.AzureUrl}/api/quiz_with_tokenised`,quiz,this.options).toPromise().then(this.extractData);
    }

    getAllOneTimeQuiz():any{
        return this.http.get(`${this.AzureUrl}/api/quiz_with_tokenised`,this.options).toPromise().then(this.extractData);
    }

    endOneTimeQuiz(id):any{
        var newObj = { QuizId: id, HasEnded: true, EndDateTime: new Date() };
        return this.http.patch(`${this.AzureUrl}/api/quiz_with_tokenised`,newObj,this.options).toPromise().then(this.extractData);
    }

    private extractData(res: Response) {
        let body = res.json();
        // console.log(body);
        return body || {};
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}