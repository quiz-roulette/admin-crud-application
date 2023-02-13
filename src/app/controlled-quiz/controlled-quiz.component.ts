import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Quiz } from '../model/Quiz';
import { HTTPService } from '../service/http.service';
import { Question } from '../model/question';
import { CorrectChoice } from '../model/CorrectChoice';
import { Choice } from '../model/choice';
import { Socket } from 'ngx-socket-io';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'controlled-quiz',
    templateUrl: 'controlled-quiz.component.html',
    styleUrls: ['controlled-quiz.component.css', 'ready-button.css']
})

export class ControlledQuizComponent implements OnInit {
    public quizname!: string;
    public categoryName!: string;
    private quiz!: Quiz;
    public currentQuestion: any;
    private currentQuestionIndex: any;
    private questions!: Question[];
    private correctChoice!: CorrectChoice[];
    private choices!: Choice[];
    private interval: any;
    public nextQuestionExists;
    public overallResults: any;
    public playerCount;

    private usersAnswersForQuestions = new Array();
    //DOM changes
    public waitingView: boolean;
    public questionView: boolean;
    public statisticsView: boolean;
    public resultView: boolean;
    public readyText: any;
    private playerInterval: any;

    constructor(private http: HTTPService, private route: ActivatedRoute, private router: Router, private socket: Socket) {
        this.currentQuestion = null;
        this.waitingView = true;
        this.questionView = false;
        this.statisticsView = false;
        this.resultView = false;
        this.nextQuestionExists = false;
        this.playerCount = 0;
    }

    ngOnInit() {
        this.quizname = this.route.snapshot.paramMap.get("quizname")!

        if (this.categoryName != null) {
            this.loadData();
        }
        var currentContext = this;
        this.socket.on("question answered", function (obj: any) {
            if (currentContext.currentQuestion != null && obj.QuestionId === currentContext.currentQuestion.QuestionId) {
                currentContext.currentQuestion.AnsweredCount++;
                currentContext.usersAnswersForQuestions.push(obj);
                currentContext.userAnsweredaQuestion(currentContext);
            }
        });
    }

    loadData() {
        this.readyText = "Preparing..."
        this.http.setUpControlledQuiz(this.categoryName).subscribe((resultEvent: any) => {
            console.log("controlled quiz ... ", resultEvent)
            if (resultEvent.type === HttpEventType.Response) {
                var result = resultEvent.body;
                this.quizname = result.QuizId;
                this.http.getQuizDataByQuizId(result.QuizId).subscribe((resultEvent1: any) => {
                    console.log("controlled quiz ... ", resultEvent)
                    if (resultEvent.type === HttpEventType.Response) {
                        var res = resultEvent.body;
                        console.log(res);
                        this.questions = res.Questions;
                        this.choices = res.Choices;
                        this.correctChoice = res.CorrectChoices;

                        //dummydata
                        console.log(this.choices);

                        this.readyText = "Get Started"
                    }
                })
            }

        })


    }

    startQuiz() {
        this.waitingView = false;
        this.socket.emit("quiz started", this.quizname);
        this.setNextQuestion()
    }

    /**
     * this.currentQuestion = {
            QuestionText: '',
            QuestionImageURL: '',
            QuestionId: 0,
            Choices: [
                'Text1', 
                'Text2'
            ],
            CorrectChoiceText: '',
            CountDownTimer: 10,
            AnsweredCount: 0
        }
     */
    setNextQuestion() {
        this.statisticsView = false;
        console.log(this.currentQuestion);
        if (this.currentQuestion == null) {
            this.currentQuestionIndex = 0;
            //set first question
            this.currentQuestion = {
                QuizId: this.quizname,
                QuestionText: this.questions[this.currentQuestionIndex].Text,
                QuestionImageURL: this.questions[this.currentQuestionIndex].ImageUrl,
                QuestionId: this.questions[this.currentQuestionIndex].QuestionId,
                Choices: this.choices.filter(el => el.QuestionId == this.questions[this.currentQuestionIndex].QuestionId),
                CorrectChoiceId: this.correctChoice.filter(el => el.QuestionId == this.questions[this.currentQuestionIndex].QuestionId)[0].ChoiceId,
                CountDownTimer: 10,
                AnsweredCount: 0
            }
        }
        else if (this.questions.length > this.currentQuestionIndex + 1) {
            //set next question based on the currentQuestion id    
            this.currentQuestionIndex = this.currentQuestionIndex + 1;
            //set first question
            this.currentQuestion = {
                QuizId: this.quizname,
                QuestionText: this.questions[this.currentQuestionIndex].Text,
                QuestionImageURL: this.questions[this.currentQuestionIndex].ImageUrl,
                QuestionId: this.questions[this.currentQuestionIndex].QuestionId,
                Choices: this.choices.filter(el => el.QuestionId == this.questions[this.currentQuestionIndex].QuestionId),
                CorrectChoiceId: this.correctChoice.filter(el => el.QuestionId == this.questions[this.currentQuestionIndex].QuestionId)[0].ChoiceId,
                CountDownTimer: 10,
                AnsweredCount: 0
            }


        }
        else {
            return;
        }
        this.socket.emit("new question", { QuizId: this.quizname, Question: this.currentQuestion });
        if (this.questions.length > this.currentQuestionIndex + 1) {
            this.nextQuestionExists = true;
        }
        else {
            this.nextQuestionExists = false;
        }

        this.questionView = true;
        var currentContext = this;
        setTimeout(function () {
            var count = currentContext.currentQuestion.CountDownTimer;
            document.getElementById('circle')!.style.webkitAnimationDuration = count + "s";
            document.getElementById('circle')!.style.animationDuration = count + "s";
            console.log(document.getElementById('circle')!.style.animation);
        }, 1000)


        //if not ended start timer
        this.interval = setInterval(function () {
            console.log(currentContext.currentQuestion);
            var count = currentContext.currentQuestion.CountDownTimer;
            var val = count

            if (count <= 0) {
                //emit stop question
                //show stats and stuff
                clearInterval(currentContext.interval);
                currentContext.stopCurrentQuestion();
            }
            document.getElementById('timer')!.innerHTML = val;

            currentContext.currentQuestion.CountDownTimer--;
        }, 1000);
    }

    userAnsweredaQuestion(currentContext: any) {
        if (currentContext.questionView) {
            var num = this.usersAnswersForQuestions.filter(el => el.QuestionId === currentContext.currentQuestion.QuestionId).length;
            currentContext.currentQuestion.AnsweredCount = num;
            //not so dummy
            var el: any = document.getElementById("answeredCount");
            el.style.transform = 'scale(1.5)';
            el.style.webkitTransform = 'scale(1.5)';
            setTimeout(function () {
                el.style.transform = 'scale(1)';
                el.style.webkitTransform = 'scale(1)';
            }, 100)
        }
    }

    stopCurrentQuestion() {
        console.log("Lets show some stats");
        this.socket.emit("stop question", {
            QuestionId: this.currentQuestion.QuestionId,
            QuizId: this.currentQuestion.QuizId
        });
        this.questionView = false;
        this.statisticsView = true;
        console.log("Analysing Stuff")
        this.anayliseData();
        this.http.getQuizLogByQuizId(this.quizname).subscribe((resultEvent: any) => {
            if (resultEvent.type === HttpEventType.Response) {
                var res = resultEvent.body;
                console.log(res);
                this.overallResults = res;
            }
        })
    }



    anayliseData() {
        console.log(this.usersAnswersForQuestions);
        var list = this.usersAnswersForQuestions.filter(el => el.QuestionId === this.currentQuestion.QuestionId);
        var sorted = list.sort((a, b) => a.Score - b.Score);

        var choices = this.currentQuestion.Choices;
        var analysedData = new Array();
        for (var i = 0; i < list.length; i++) {
            if (analysedData[list[i].ChoiceId] == undefined || Number.isNaN(analysedData[list[i].ChoiceId])) {
                analysedData[list[i].ChoiceId] = 1;
            }
            else analysedData[list[i].ChoiceId] = analysedData[list[i].ChoiceId] + 1;
        }
        var extraDataChoices = new Array();
        for (var i = 0; i < choices.length; i++) {
            var choice = choices[i];
            if (analysedData[choice.ChoiceId] != undefined || !Number.isNaN(analysedData[choice.ChoiceId]))
                choice.AnsweredCount = analysedData[choice.ChoiceId];
            else choice.AnsweredCount = 0;
        }

        var top3CurrentQuestion = new Array();
        for (var i = 0; i < 3 && i < sorted.length; i++) {
            top3CurrentQuestion.push(sorted[i]);
        }

        this.currentQuestion.top3CurrentQuestion = top3CurrentQuestion;
    }

    showResults() {
        this.statisticsView = false;
        this.resultView = true;
        this.socket.emit("stop quiz", this.quizname);
    }

}