export class Question {
    QuestionId: number;
    text: string;
    CategoryName: string;

    constructor() {
        this.QuestionId = 0;
        this.text = "";
        this.CategoryName = "";
    }
}