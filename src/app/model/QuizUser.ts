export class QuizUser{
    QuizUserId: string;
    IsAdmin: boolean;
    Password: string;
    Avatar: string;
    isOnline: boolean;

    /**
     *
     */
    constructor() {
        this.isOnline = false;
        this.IsAdmin = false;
    }
}

export class QuizUserCheck {
    QuizUserId: string;
    Checked: boolean;

    /**
     *
     */
    constructor(id: string,checked) {
        this.QuizUserId = id;
        this.Checked = checked;
    }
}