export class QuizLog{
    QuizUserId: string;
    TimeTaken: number;
    Score: number;
    SIMID: string;
    Name: string;
    ClubName: string;
    
    addQuizInfo(quizuserid, timetaken, score){
        this.QuizUserId = quizuserid;
        this.TimeTaken = timetaken;
        this.Score = score;
    }

    addUserInfo(simid, name, clubname){
        this.SIMID = simid;
        this.Name = name;
        this.ClubName = clubname;
    }
}