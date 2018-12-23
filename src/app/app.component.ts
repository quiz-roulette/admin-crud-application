import { Component } from '@angular/core';
import { UserGuard } from './guard/User.guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(public authGuard: UserGuard){

  }
}
