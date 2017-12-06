import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HTTPService } from './service/http.service';
import { QuestionComponent } from './questions/question.component';
import { Http, HttpModule } from '@angular/http';
import { AzureService } from './service/azure.service';
import { StatusComponent } from './component/status/status.component';

@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    StatusComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  providers: [HTTPService,AzureService],
  bootstrap: [AppComponent]
})
export class AppModule { }
