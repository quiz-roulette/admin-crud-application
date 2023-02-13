export class QuizLog {
    QuizUserId: string | undefined;
    TimeTaken: number | undefined;
    Score: number | undefined;
    SIMID: string | undefined;
    Name: string | undefined;
    ClubName: string | undefined;
    Result: number | undefined;

    addQuizInfo(quizuserid: any, timetaken: any, score: any, result: any) {
        this.QuizUserId = quizuserid;
        this.TimeTaken = timetaken;
        this.Score = score;
        this.Result = result;
    }

    addUserInfo(simid: any, name: any, clubname: any) {
        this.SIMID = simid;
        this.Name = name;
        this.ClubName = clubname;
    }
}