import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HTTPService } from './service/http.service';
import { QuestionComponent } from './questions/question.component';
import { Http, HttpModule } from '@angular/http';
import { AzureService } from './service/azure.service';

@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [HTTPService,AzureService],
  bootstrap: [AppComponent]
})
export class AppModule { }
