export class QuizLog{
    QuizUserId: string;
    TimeTaken: number;
    Score: number;
    SIMID: string;
    Name: string;
    ClubName: string;
    Result: number;
    
    addQuizInfo(quizuserid, timetaken, score,result){
        this.QuizUserId = quizuserid;
        this.TimeTaken = timetaken;
        this.Score = score;
        this.Result = result;
    }

    addUserInfo(simid, name, clubname){
        this.SIMID = simid;
        this.Name = name;
        this.ClubName = clubname;
    }
}