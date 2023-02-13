export class QuizUser {
    QuizUserId: string | null | undefined;
    IsAdmin: boolean;
    Password: string | undefined;
    Avatar: string | undefined;
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
    QuizUserId: string | undefined | null;
    Checked: boolean;

    /**
     *
     */
    constructor(id: string | undefined | null, checked: boolean) {
        this.QuizUserId = id;
        this.Checked = checked;
    }
}