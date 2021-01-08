import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { QuestionComponent } from './components/question/question.component';

import { HomeComponent } from './pages/home/home.component';
import { HelpComponent } from './pages/help/help.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';

import { PracticeComponent } from './pages/practice/practice.component';
import { TestComponent } from './pages/test/test.component';
import { LearnComponent } from './pages/learn/learn.component';
import { LabelsComponent } from './components/labels/labels.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    HelpComponent,
    NotfoundComponent,
    QuestionComponent,
    PracticeComponent,
    TestComponent,
    LearnComponent,
    LabelsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
