import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { Result } from '../../model/Result';

@Component({
    moduleId: module.id,
    selector: 'status',
    templateUrl: 'status.component.html',
    styleUrls: ['status.component.css']
})

export class StatusComponent implements OnInit {
    @Input() result: Result;
    @Output() updatedResult =  new EventEmitter();

    constructor() { }

    ngOnInit() { }

    hideError(){
        this.result = new Result();
        this.updatedResult.emit(this.result);
    }
}