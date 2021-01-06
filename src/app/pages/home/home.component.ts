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
  constructor(private idb: IdbService, private api: ApiService) {}

  ngOnInit(): void {
    let label = '2017-02-01';
    this.idb.questions
      .orderBy('updated_at')
      .reverse()
      .filter((q) => q.labels.indexOf(label) > -1)
      .limit(5)
      .each((q) => {
        if (!q.question) {
          let path =
            'questions' +
            q.id
              .substr(0, 6)
              .split('')
              .map((a, i) => (i % 2 == 0 ? '/' + a : a))
              .join('') +
            '/' +
            q.id.substr(6, 30) +
            '/';

          this.api.get(path).subscribe((json) => {
            console.log(json);
            this.idb.questions.put(json);
            this.questions.push(json);
          });
        } else {
          this.questions.push(q);
        }
      });
  }
}
