export class Question {
    QuestionId: number;
    Text: string;
    CategoryName: string;
    ImageUrl: string | null;

    constructor() {
        this.QuestionId = 0;
        this.Text = "";
        this.CategoryName = "";
        this.ImageUrl = null;
    }
}