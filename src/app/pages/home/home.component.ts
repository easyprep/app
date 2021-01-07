import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces/question';
import { ApiService } from 'src/app/services/api.service';
import { IdbService } from 'src/app/services/idb.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  questions: Question[] = [];
  constructor(private idb: IdbService, private api: ApiService) { }

  ngOnInit(): void {
    let label = '2017-02-01';
    this.idb.questions
      .orderBy('updated_at')
      .reverse()
      .limit(5)
      .each((q: Question) => {
        this.questions.push(q);
      });
  }

  response(id: string, e: any) {
    console.log(id, e);
  }
}
