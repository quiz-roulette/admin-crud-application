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