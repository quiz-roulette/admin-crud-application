export class Question {
    questionId: number;
    text: string;
    categoryId: string;

    constructor() {
        this.questionId = 0;
        this.text = "";
        this.categoryId = "";
    }
}