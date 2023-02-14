import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'not-found',
    templateUrl: 'NotFound.component.html'
})
export class NotFoundComponent implements OnInit {
    message: any;
    constructor() { }
    ngOnInit() { 
        this.message = "Not Found"
    }
}
