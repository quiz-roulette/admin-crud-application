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
    private quizname: String;
    private quiz: Quiz;
    public currentQuestion;
    private currentQuestionId;
    private questions: Question[];
    private correctChoice: CorrectChoice[];
    private choices: Choice[];
    private interval;
    //DOM changes
    private waitingView: boolean;
    private statisticsView: boolean;
    private resultView: boolean;
    constructor(private http: HTTPService, private route: ActivatedRoute, private router: Router, private socket: Socket) {
        this.currentQuestion = null;
        this.currentQuestionId = -1;
        this.waitingView = true;
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
        console.log(this.currentQuestion);
        if(this.currentQuestion == null){
            //set first question
            this.currentQuestion = {
                QuestionText: 'Question is Question',
                QuestionImageURL: '',
                QuestionId: 0,
                Choices: [
                    'Text1', 
                    'Text2',
                    'Text3'
                ],
                CorrectChoiceText: '',
                CountDownTimer: 10,
                AnsweredCount: 0
            }
        }
        else{
            //set next question based on the currentQuestion id    
        }
        this.currentQuestionId = this.currentQuestion.QuestionId;
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
        this.currentQuestion = null;
        this.statisticsView = true;
    }

}