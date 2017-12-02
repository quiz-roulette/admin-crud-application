export class Question {
    QuestionId: number;
    Text: string;
    CategoryName: string;

    constructor() {
        this.QuestionId = 0;
        this.Text = "";
        this.CategoryName = "";
    }
}