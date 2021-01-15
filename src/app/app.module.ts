import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth'

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
import { LabelComponent } from './components/label/label.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { BiComponent } from './components/bi/bi.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

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
    LabelsComponent,
    LabelComponent,
    BreadcrumbsComponent,
    CalendarComponent,
    BiComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
