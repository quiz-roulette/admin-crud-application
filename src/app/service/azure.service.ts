import { Injectable } from '@angular/core';
declare var WindowsAzure: { MobileServiceClient: new (arg0: string) => any; };

@Injectable()
export class AzureService {
    private client: any;

    constructor() {
        this.client = new WindowsAzure.MobileServiceClient("https://arck9app.azurewebsites.net");
     }

    getAllQuestions(){
        var table = this.client.getTable("question");
        var current = this;
        return new Promise((resolve, reject) => {
            table.read()
                .done(function (questions: any) {
                   resolve(questions);
                }, function (error: any) { reject(error) });
        });
    }

    getAddQuestion(){
        var table = this.client.getTable("arck9_user");
        var current = this;
        return new Promise((resolve, reject) => {
            table.insert({ text: "new question", categoryId: "simaa"})
                .done(function (newQuestion: any) {
                   resolve(newQuestion);
                }, function (error: any) { reject(error) });
        });
    }
}