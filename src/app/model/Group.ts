export class Group{
    Name: string;
    QuizUserCount: Number;
}

export class GroupCheck {
    Name: string;
    Checked: boolean;

    /**
     *
     */
    constructor(id: string,checked) {
        this.Name = id;
        this.Checked = checked;
    }
}