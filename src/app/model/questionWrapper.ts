import { Question } from "./question";
import { Choice } from "./choice";
import { CorrectChoice } from "./CorrectChoice";

export class QuestionWrapper extends Question{
    choice: Choice[];
    correctChoice: CorrectChoice;
    correctChoiceText: string;
    /**
     *
     */
    constructor() {
        super();
        this.choice = new Array<Choice>();
        this.correctChoice = new CorrectChoice();
        this.correctChoiceText = "";
    }

    /**
     * the choices argument is a string array
     */
    setChoices(choices: string[]){
        choices.forEach(element => {
            var choice = new Choice();
            choice.Text = element;
            this.choice.push(choice);
        });
    }
}