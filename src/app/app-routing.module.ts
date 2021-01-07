import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpComponent } from './pages/help/help.component';
import { HomeComponent } from './pages/home/home.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { PracticeComponent } from './pages/practice/practice.component';
import { LearnComponent } from './pages/learn/learn.component';
import { TestComponent } from './pages/test/test.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'help',
    component: HelpComponent,
  },
  {
    path: 'learn',
    children: [
      {
        path: ':id',
        component: LearnComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'random'
      }
    ],
  },
  {
    path: 'practice',
    children: [
      {
        path: ':id',
        component: PracticeComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'random'
      }
    ],
  },
  {
    path: 'test',
    children: [
      {
        path: ':id',
        component: TestComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'random'
      }
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: '**',
    component: NotfoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
