import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { QuestionWrapper } from '../model/questionWrapper';
import { Question } from '../model/question';
import { Choice } from '../model/choice';
import { CorrectChoice } from '../model/CorrectChoice';
import { QuizUser } from '../model/QuizUser';
import { Category } from '../model/category';

@Injectable()
export class HTTPService {
    private AzureUrl = "https://axperienceapp.azurewebsites.net/api";
    private KubernetesWorld = "http://localhost:8080/legacy"
    options: any;


    Login(quizUserId: any, password: any) {
        return this.http.get<boolean>(`${this.KubernetesWorld}/authenticate?userId=${quizUserId}&userPassword=${password}&isAdmin=${true}`, this.options);
    }

    getAllQuizUsers(): any {
        return this.http.get(`${this.AzureUrl}/api/quizuser`, this.options);
    }


    constructor(private http: HttpClient) {
        this.options = {
            headers: new HttpHeaders({
                'ZUMO-API-VERSION': '2.0.0',
                'authorization': this.getUserFromLocal(),
                'admin': this.getUserFromLocal(),
                'SIM': "true",
                'observe': 'body'
            })
        };
    }

    private getUserFromLocal(): string {
        return localStorage.getItem('user') ?? '';
    }

    updateOptions() {
        this.options = {
            headers: new HttpHeaders({
                'ZUMO-API-VERSION': '2.0.0',
                'authorization': this.getUserFromLocal(),
                'admin': this.getUserFromLocal(),
                'SIM': "true"
            })
        };
    }

    /**
     * returns all the questions from the database
     */
    getAllQuestions() {
        return this.http.get<Question[]>(`${this.KubernetesWorld}/question`, this.options);
    }

    /**
     * returns all the choices from the database
     */
    getAllChoices() {
        return this.http.get<Choice[]>(`${this.KubernetesWorld}/choice`, this.options);
    }

    /**
     * returns all the correctChoices from the database
     */
    getAllCorrectChoices() {
        return this.http.get<CorrectChoice[]>(`${this.KubernetesWorld}/correctChoice`, this.options);
    }


    getAllCategories() {
        return this.http.get(`${this.KubernetesWorld}/category`, this.options);
    }

    /**
     * 
     * @param questionWrapper Adds a new wrapper to the database
     * layer 1: Adds question to the database
     * layer 2: It loops for the choices(because there has to be more than 1 choice) and add one by one to the database
     * layer 3: It get the choiceId of the correctChoice and add that to the database.
     */
    addQuestionWrapper(questionWrapper: QuestionWrapper): Promise<QuestionWrapper> {
        console.log("Lets add a question in backend ", questionWrapper);
        this.http.post(`${this.KubernetesWorld}/questionwrapper`, questionWrapper, this.options);
        return new Promise<QuestionWrapper>(resolve => {
            resolve(questionWrapper);
        });
    }

    /**
     * 
     * @param text 
     * @param category 
     * it adds the text and category to the database
     */
    addQuestion(text: string | undefined | null, category: string | undefined | null, imageUrl: string | undefined | null) {
        return this.http.post<Question>(`${this.KubernetesWorld}/question`, { Text: text, CategoryName: category, ImageUrl: imageUrl }, this.options);
    }

    addChoice(questionId: any, text: any) {
        return this.http.post<Choice>(`${this.KubernetesWorld}/choice`, { Text: text, QuestionId: questionId }, this.options);
    }

    addUser(user: QuizUser) {
        return this.http.post(`${this.KubernetesWorld}/quizuser`, user, this.options);
    }

    addCategory(category: Category): any {
        return this.http.post<Category>(`${this.KubernetesWorld}/category`, category, this.options);
    }

    assignUserToGroup(groupname: string | undefined | null, userid: string | undefined | null) {
        // console.log({ GName: groupname, UserId: userid });
        return this.http.post(`${this.AzureUrl}/api/quizusergroup_join`, { GName: groupname, UserId: userid }, this.options);
    }

    getUsersForGroup(gname: string | undefined | null) {
        return this.http.get(`${this.AzureUrl}/api/quizusergroup_join?groupName=` + gname, this.options);
    }

    getGroupsForUser(quizUserId: string | undefined | null) {
        return this.http.get(`${this.AzureUrl}/api/quizusergroup_join?quizUserId=` + quizUserId, this.options);
    }

    assignCustomUsersToGroup(users: QuizUser[], group: string | undefined | null): any {
        return new Promise<boolean>(resolve => {
            resolve(true);
        });
    }

    assignCustomGroupsToUser(groups: any, user: string | undefined | null): any {
        return new Promise<boolean>(resolve => {
            resolve(true);
        });
    }

    deleteAllUsersForGroup(gname: string | undefined | null) {
        return this.http.delete(`${this.AzureUrl}/api/quizusergroup_join?groupName=` + gname, this.options);
    }

    deleteAllGroupsForUser(userid: string | undefined | null) {
        return this.http.delete(`${this.AzureUrl}/api/quizusergroup_join?quizUserId=` + userid, this.options);
    }

    getAllUserGroupNames() {
        return this.http.get(`${this.AzureUrl}/api/group`, this.options);
    }

    getAllGroups() {
        return this.getAllUserGroupNames();
    }

    addGroup(group: any) {
        return this.http.post(`${this.AzureUrl}/api/group`, group, this.options);
    }

    deleteGroup(name: string | undefined | null) {
        return this.http.delete(`${this.AzureUrl}/api/group?groupname=${name}`, this.options);
    }

    assignUsersToGroup(groupname: string | undefined | null) {
        return new Promise<boolean>(resolve => {
            resolve(true);
        });
    }

    assignGroupsToUser(userId: string | undefined | null) {
        return new Promise<boolean>(resolve => {
            resolve(true);
        });
    }

    /**
     * 
     * @param questionId of which the correct choice is being entered.
     * @param choiceId of which the correct question is being entered.
     */
    addCorrectChoice(questionId: any, choiceId: any) {
        return this.http.post(`${this.AzureUrl}/api/correctChoice`, { QuestionId: questionId, ChoiceId: choiceId }, this.options);
    }

    /**
     * 
     * @param questionId the question id that needs to be deleted.
     * It called a HTTP patch method, that contains a JSON object with attributes { questionId: 0, isDelete: true}.
     * @example httpService.deleteQuestion(1).then((data) => { // console.log("deleted Succesfully")});
     */
    deleteQuestion(questionId: any) {
        return this.http.patch(`${this.KubernetesWorld}/question`, { QuestionId: questionId, IsDelete: true }, this.options);
    }

    deleteUser(userId: string | undefined | null) {
        return this.http.delete(`${this.KubernetesWorld}/quizUser?QuizUserId=${userId}`, this.options);
    }

    deleteCategory(categoryName: any): any {
        return this.http.delete(`${this.KubernetesWorld}/category?CategoryName=${categoryName}`, this.options);
    }

    addQuiz(quiz: any): any {
        return this.http.post(`${this.KubernetesWorld}/quiz`, quiz, this.options);
    }

    getAllQuiz(): any {
        return this.http.get(`${this.KubernetesWorld}/quiz`, this.options);
    }

    endQuiz(id: any): any {
        var newObj = { QuizId: id, HasEnded: true, EndDateTime: new Date() };
        return this.http.patch(`${this.KubernetesWorld}/quiz`, newObj, this.options);
    }

    addOneTimeQuiz(quiz: any): any {
        return this.http.post(`${this.KubernetesWorld}/quiz_with_tokenised`, quiz, this.options);
    }

    getAllOneTimeQuiz(): any {
        return this.http.get(`${this.KubernetesWorld}/quiz_with_tokenised`, this.options);
    }

    endOneTimeQuiz(id: any): any {
        var newObj = { QuizId: id, HasEnded: true, EndDateTime: new Date() };
        return this.http.patch(`${this.KubernetesWorld}/quiz_with_tokenised`, newObj, this.options);
    }

    getAllQuizLog(quizname: any) {
        return this.http.get(`${this.KubernetesWorld}/quizlog?QuizId=${quizname}`, this.options);
    }

    getQuizUser(quizuserId: any): any {
        return this.http.get(`${this.AzureUrl}/api/quizuser?QuizUserId=${quizuserId}`, this.options);
    }

    getCategoryQuestionCount(categoryName: string | undefined | null): any {
        return this.http.get(`${this.KubernetesWorld}/getQuestionCountForCategory?CategoryName=${categoryName}`, this.options);
    }

    setUpControlledQuiz(catName: any) {
        return this.http.post(`${this.KubernetesWorld}/setupControlledQuiz`, { CategoryName: catName }, this.options);
    }

    getQuizDataByQuizId(quizId: string | undefined | null) {
        return this.http.get(`${this.AzureUrl}/api/quizDataByQuizId?QuizId=${quizId}`, this.options);
    }

    getQuizLogByQuizId(quizId: string | undefined | null) {
        return this.http.get(`${this.KubernetesWorld}/quizlog?QuizId=${quizId}`, this.options);
    }

    private extractData(res: any) {
        let body = res.json();
        // console.log(body);
        return body || {};
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}