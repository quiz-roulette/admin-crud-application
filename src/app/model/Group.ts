export class Group {
    Name: string | undefined;
    QuizUserCount: Number | undefined;
}

export class GroupCheck {
    Name: string | undefined;
    Checked: boolean;

    /**
     *
     */
    constructor(id: string | undefined, checked: any) {
        this.Name = id;
        this.Checked = checked;
    }
}