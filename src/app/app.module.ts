import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HTTPService } from './service/http.service';
import { QuestionComponent } from './questions/question.component';
import { Http, HttpModule } from '@angular/http';
import { AzureService } from './service/azure.service';
import { StatusComponent } from './component/status/status.component';
import {AppRoutingModule, routableComponents } from './app-routing.module';
import { AddQuestionComponent } from './questions/add-question/add-question.component';
import { PipeModule } from './app-pipe.module';
import { AuthenticationComponent } from './authentication/authentication.component';
import { UserGuard } from './guard/User.guard';
import { NavbarComponent } from './component/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    routableComponents,
    AddQuestionComponent,
    StatusComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
    PipeModule.forRoot()
  ],
  providers: [
    HTTPService,
    AzureService,
    UserGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
