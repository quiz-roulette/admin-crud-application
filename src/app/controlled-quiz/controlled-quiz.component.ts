import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Quiz } from '../model/Quiz';
import { HTTPService } from '../service/http.service';
import { Question } from '../model/question';
import { CorrectChoice } from '../model/CorrectChoice';
import { Choice } from '../model/choice';
import { Socket } from 'ng-socket-io';

@Component({
    selector: 'controlled-quiz',
    templateUrl: 'controlled-quiz.component.html',
    styleUrls: ['controlled-quiz.component.css', 'ready-button.css']
})

export class ControlledQuizComponent implements OnInit {
    private sub: Subscription;
    public quizname: String;
    private quiz: Quiz;
    public currentQuestion;
    private currentQuestionIndex;
    private questions: Question[];
    private correctChoice: CorrectChoice[];
    private choices: Choice[];
    private interval;
    private nextQuestionExists;
    public overallResults;
    public playerCount;
    /**
     * usersAnswersForQuestions: {
     *  ChoiceId: '',
     *  Questionid: ''
     * }
     */
    private usersAnswersForQuestions = new Array();
    //DOM changes
    public waitingView: boolean;
    public questionView: boolean;
    public statisticsView: boolean;
    public resultView: boolean;
    public readyText;
    private playerInterval;
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
        this.sub = this.route.params.subscribe((params: Params) => {
            this.quizname = params['quizname'];
        });

        if (this.quizname != null) {
            this.loadData();
        }
        var currentContext = this;
        this.socket.on("question answered", function (obj) {
            if (currentContext.currentQuestion != null && obj.QuestionId === currentContext.currentQuestion.QuestionId) {
                currentContext.currentQuestion.AnsweredCount++;
                currentContext.usersAnswersForQuestions.push(obj);
                currentContext.userAnsweredaQuestion(currentContext);
            }
        });

        //dummy socket
        this.socket.on("stop question", function(obj){
            console.log("Successfully received: stop question");
            console.log(obj);
        });

        this.socket.on("new question", function(obj){
            console.log("Successfully received: new question");
            console.log(obj);
        });

        this.socket.on("quiz ended", function(obj){
            console.log("Successfully received: quiz ended");
            console.log(obj);
        });
    }

    loadData() {
        this.readyText = "Preparing..."
        this.http.getQuizDataByQuizId(this.quizname).then((res) => {
            console.log(res);
            this.questions = res.Questions;
            this.choices = res.Choices;
            this.correctChoice = res.CorrectChoices;

            //dummydata
            console.log(this.choices);
            // this.usersAnswersForQuestions = new Array();
            // for (var i = 0; i < 100; i++) {
            //     var ran = Math.random();
            //     ran = ran > 0.5 ? 250 : 0;
            //     var userId = Math.floor((Math.random() * 100) + 1);
            //     var index = Math.floor((Math.random() * this.questions.length) + 1);
            //     var choices = this.choices.filter(el => el.QuestionId === this.questions[index - 1].QuestionId)
            //     var choiceIndex = Math.floor((Math.random() * choices.length) + 1);
            //     console.log({
            //         QuestionId: this.questions[index - 1].QuestionId,
            //         ChoiceId: choices[choiceIndex - 1].ChoiceId
            //     });
            //     this.usersAnswersForQuestions.push({
            //         QuizUserId: "User "+userId,
            //         QuestionId: this.questions[index - 1].QuestionId,
            //         ChoiceId: choices[choiceIndex - 1].ChoiceId,
            //         Score: ran
            //     })

            //     this.readyText = "Get Started"
            // }
            // console.log(this.usersAnswersForQuestions);

            this.readyText = "Get Started"
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
        this.socket.emit("new question", { QuizId: this.quizname, Question: this.currentQuestion});
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
            document.getElementById('circle').style.webkitAnimationDuration = count + "s";
            document.getElementById('circle').style.animationDuration = count + "s";
            console.log(document.getElementById('circle').style.animation);
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
            document.getElementById('timer').innerHTML = val;

            currentContext.currentQuestion.CountDownTimer--;
        }, 1000);

        // setInterval(function () {
        //     currentContext.userAnsweredaQuestion(currentContext);
        // }, 2000)

        setInterval(function(){
                var ran = Math.random();
                ran = ran > 0.5 ? 250 : 0;
                var userId = Math.floor((Math.random() * 100) + 1);
                var index = Math.floor((Math.random() * currentContext.questions.length) + 1);
                var choices = currentContext.choices.filter(el => el.QuestionId === currentContext.questions[index - 1].QuestionId)
                var choiceIndex = Math.floor((Math.random() * choices.length) + 1);
                console.log({
                    QuestionId: currentContext.questions[index - 1].QuestionId,
                    ChoiceId: choices[choiceIndex - 1].ChoiceId
                });
                var obj = {
                    QuizUserId: "User "+userId,
                    QuestionId: currentContext.questions[index - 1].QuestionId,
                    ChoiceId: choices[choiceIndex - 1].ChoiceId,
                    Score: ran
                };
                currentContext.socket.emit("question answered", obj);
        }, 1000)
    }

    userAnsweredaQuestion(currentContext){
        if (currentContext.questionView) {
            var num = this.usersAnswersForQuestions.filter(el => el.QuestionId === currentContext.currentQuestion.QuestionId).length;
            currentContext.currentQuestion.AnsweredCount = num;
            //not so dummy
            var el = document.getElementById("answeredCount");
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
        this.socket.emit("stop question", this.currentQuestion.QuestionId);
        this.questionView = false;
        this.statisticsView = true;
        console.log("Analysing Stuff")
        this.anayliseData();
        this.http.getQuizLogByQuizId(this.quizname).then((res) => {
            console.log(res);
            this.overallResults = res;
        })
    }



    anayliseData() {
        console.log(this.usersAnswersForQuestions);
        var list = this.usersAnswersForQuestions.filter(el => el.QuestionId === this.currentQuestion.QuestionId);
        var sorted = list.sort((a,b) => a.Score - b.Score);
        
        var choices = this.currentQuestion.Choices;
        var analysedData = new Array();
        for (var i = 0; i < list.length; i++) {
            if (analysedData[list[i].ChoiceId] == undefined || analysedData[list[i].ChoiceId] == NaN) {
                analysedData[list[i].ChoiceId] = 1;
            }
            else analysedData[list[i].ChoiceId] = analysedData[list[i].ChoiceId] + 1;
        }
        var extraDataChoices = new Array();
        for (var i = 0; i < choices.length; i++) {
            var choice = choices[i];
            if (analysedData[choice.ChoiceId] != undefined || analysedData[choice.ChoiceId] != NaN)
                choice.AnsweredCount = analysedData[choice.ChoiceId];
            else choice.AnsweredCount = 0;
        }

        var top3CurrentQuestion = new Array();
        for(var i=0; i<3 && i < sorted.length; i++){
            top3CurrentQuestion.push(sorted[i]);
        }

        this.currentQuestion.top3CurrentQuestion = top3CurrentQuestion;
    }

    showResults() {
        this.statisticsView = false;
        this.resultView = true;
    }

}