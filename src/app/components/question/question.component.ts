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
  @Input() id: string = '';
  @Input() updated_at: Date = new Date(0);
  @Input() quizMode: boolean = false;
  @Output() response = new EventEmitter<any>();
  @Output() loaded = new EventEmitter<any>();

  question: Question | null = null;
  optionSelected: string | null = null;
  attempted = false;
  showAnswer = false;

  constructor(private api: ApiService, private idb: IdbService) {}

  ngOnInit(): void {
    if (!this.id) return;

    this.loaded.emit({ id: this.id, loaded: false });

    let path =
      'questions' +
      this.id
        .substr(0, 6)
        .split('')
        .map((a, i) => (i % 2 == 0 ? '/' + a : a))
        .join('') +
      '/' +
      this.id.substr(6, 30) +
      '/';

    this.api.get(path).subscribe((json) => {
      if (!json) return;
      //console.log(json.id);

      let q = Object.create(json);

      q.labels = q.labels.split(',');
      let options = [];
      for (let key in q) {
        if (key.indexOf('option') == 0) {
          options.push(q[key]);
          delete q[key];
        }
      }

      q.options = options;
      q.explanation = q.explanation.replace('Let us discuss.', '');
      this.question = q;

      if (q.updated_at < this.updated_at) {
        this.api.refreshPath(path);
      }

      this.loaded.emit({ id: q.id, loaded: true });
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
