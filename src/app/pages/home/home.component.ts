import { Component, OnInit } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  rootList: Observable<any> = new Observable();
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.rootList = this.api.get('quizzes');
  }
}
