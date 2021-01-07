import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Question } from 'src/app/interfaces/question';
import { ApiService } from 'src/app/services/api.service';
import { IdbService } from 'src/app/services/idb.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})

export class QuestionComponent implements OnInit {
  @Input() id = "";
  @Input() quizMode = false;
  @Output() response = new EventEmitter<any>();

  question: Question | null = null;
  optionSelected: string | null = null;
  attempted = false;
  showAnswer = false;

  constructor(
    private api: ApiService,
    private idb: IdbService
  ) { }

  ngOnInit(): void {
    this.idb.questions.get(this.id)
      .then(q => {
        if (q) {
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
              json.labels = json.labels.split(',');
              let options = [];
              for (let key in json) {
                if (key.indexOf("option") == 0) {
                  options.push(json[key]);
                  delete json[key];
                }
              }
              json.options = options;
              this.idb.questions.put(json);
              this.question = json;
            });
          } else {
            this.question = q;
          }
        }
      });
  }

  checkAns(o: any, e: any) {
    e.blur();
    if (this.quizMode) {
      if (this.optionSelected != o) {
        this.optionSelected = o;
        this.response.emit(o == this.question?.answer);
      } else {
        this.optionSelected = null;
        this.response.emit(null);
      }
    } else {
      if (!this.attempted) {
        e.classList.add('text-light');
        if (o == this.question?.answer) {
          e.classList.add('bg-success');
          this.response.emit(1);
        } else {
          e.classList.add('bg-danger');
          this.response.emit(0);
          this.showAnswer = true;
        }
        this.attempted = true;
      }
    }
  }
}
