import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HTTPService } from './service/http.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StatusComponent } from './component/status/status.component';
import {AppRoutingModule, routableComponents } from './app-routing.module';
import { AddQuestionComponent } from './questions/add-question/add-question.component';
import { PipeModule } from './app-pipe.module';
import { AuthenticationComponent } from './authentication/authentication.component';
import { UserGuard } from './guard/User.guard';
import { NavbarComponent } from './component/navbar/navbar.component';
import { AddQuizComponent } from './component/quizes/add-quiz/add-quiz.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AddOneTimeQuizComponent } from './component/one-time-quiz/add-one-time-quiz/add-one-time-quiz.component';
import { NotFoundComponent } from './component/not-found/NotFound.Component';
const config: SocketIoConfig = { url: 'https://axperience.herokuapp.com/', options: {} };
@NgModule({
  declarations: [
    AppComponent,
    routableComponents,
    AddQuestionComponent,
    AddQuizComponent,
    AddOneTimeQuizComponent,
    StatusComponent,
    NavbarComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    PipeModule.forRoot(),
    SocketIoModule.forRoot(config) 
  ],
  providers: [
    HTTPService,
    UserGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
