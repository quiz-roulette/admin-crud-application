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
    styleUrls: ['controlled-quiz.component.css']
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
    constructor(private http: HTTPService, private route: ActivatedRoute, private router: Router, private socket: Socket) {
        this.currentQuestion = null;
        this.waitingView = true;
        this.questionView = false;
        this.statisticsView = false;
        this.resultView = false;
     }

    ngOnInit() {
        this.sub = this.route.params.subscribe((params: Params) => {
            this.quizname = params['quizname'];
        });

        if (this.quizname != null) {
            this.loadData();
        }

        this.socket.on("question answered", function(obj){
            if(this.currentQuestion != null && obj.QuestionId === this.currentQuestion.QuestionId){
                this.currentQuestion.AnsweredCount++;
            }
        });
    }

    loadData() {
        this.http.getQuizDataByQuizId(this.quizname).then((res) => {
            console.log(res);
            this.questions = res.Questions;
            this.choices = res.Choices;
            this.correctChoice = res.CorrectChoices;
        })
    }

    startQuiz(){
        this.waitingView = false;
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
        if(this.currentQuestion == null){
            this.currentQuestionIndex = 0;
            //set first question
            this.currentQuestion = {
                QuestionText: this.questions[this.currentQuestionIndex].Text,
                QuestionImageURL: this.questions[this.currentQuestionIndex].ImageUrl,
                QuestionId: this.questions[this.currentQuestionIndex].QuestionId,
                Choices: this.choices.filter(el => el.QuestionId == this.questions[this.currentQuestionIndex].QuestionId),
                CorrectChoiceText: this.correctChoice.filter(el => el.QuestionId == this.questions[this.currentQuestionIndex].QuestionId)[0],
                CountDownTimer: 10,
                AnsweredCount: 0
            }
        }
        else if(this.questions.length > this.currentQuestionIndex + 1){
            //set next question based on the currentQuestion id    
            this.currentQuestionIndex = this.currentQuestionIndex + 1;
            //set first question
            this.currentQuestion = {
                QuestionText: this.questions[this.currentQuestionIndex].Text,
                QuestionImageURL: this.questions[this.currentQuestionIndex].ImageUrl,
                QuestionId: this.questions[this.currentQuestionIndex].QuestionId,
                Choices: this.choices.filter(el => el.QuestionId == this.questions[this.currentQuestionIndex].QuestionId),
                CorrectChoiceText: this.correctChoice.filter(el => el.QuestionId == this.questions[this.currentQuestionIndex].QuestionId)[0],
                CountDownTimer: 10,
                AnsweredCount: 0
            }
        }
        else{
            return;
        }
        this.questionView = true;
        var currentContext =  this;
        setTimeout(function(){
            var count = currentContext.currentQuestion.CountDownTimer;
            document.getElementById('circle').style.webkitAnimationDuration = count+"s";
            document.getElementById('circle').style.animationDuration = count+"s";
            console.log(document.getElementById('circle').style.animation);
        }, 1000)
        
        
        //if not ended start timer
        this.interval = setInterval(function(){
            console.log(currentContext.currentQuestion);
            var count = currentContext.currentQuestion.CountDownTimer;
            var val = count

            if(count <= 0){
                //emit stop question
                //show stats and stuff
                clearInterval(currentContext.interval);
                currentContext.stopCurrentQuestion();
            }
            document.getElementById('timer').innerHTML = val;
            
            currentContext.currentQuestion.CountDownTimer--;
        }, 1000);
    }

    stopCurrentQuestion(){
        console.log("Lets show some stats");
        this.questionView = false;
        this.statisticsView = true;
    }

    

    anayliseData(){
        var list = this.usersAnswersForQuestions.filter(el => el.QuestionId === this.currentQuestion.QuestionId);
        var choices = this.currentQuestion.Choices;
        var analysedData = new Array();
        for(var i=0; i<list.length; i++){
            analysedData[list[i].ChoiceId] = analysedData[list[i].ChoiceId] + 1;
        }

        console.log(analysedData);
    }

}