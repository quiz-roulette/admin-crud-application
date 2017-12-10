export class Question {
    QuestionId: number;
    Text: string;
    CategoryName: string;
    ImageUrl: string;

    constructor() {
        this.QuestionId = 0;
        this.Text = "";
        this.CategoryName = "";
        this.ImageUrl = null;
    }
}