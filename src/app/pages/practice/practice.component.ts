import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces/question';
import { IdbService } from 'src/app/services/idb.service';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Label } from 'src/app/interfaces/label';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss'],
})
export class PracticeComponent implements OnInit {
  label = '';
  labelObj: Label | null = null;
  labelQuestionCount = 0;
  questions: Question[] = [];

  offset = 0;
  count = 0;
  path = '';
  prevIndexFile: string | null = null;

  showPaginator: BehaviorSubject<any> = new BehaviorSubject(false);

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  next() {
    this.offset++;
    if (this.count - this.offset == 1) {
      this.fetchPrevIndex();
    }
  }

  prev() {
    this.offset--;
  }

  fetchPrevIndex() {
    if (this.prevIndexFile) {
      this.showQuestions(this.path, this.prevIndexFile);
    }
  }

  showQuestions(path: string, file: string = '') {
    if (path) {
      if (path !== this.path) {
        this.count = 0;
        this.offset = 0;
        this.showPaginator.next(false);
        this.questions = [];
      }
      this.path = path;
      this.api.get('labels/' + path + file).subscribe((json) => {
        if (!json) return;
        console.log(json);

        this.questions = [...this.questions, ...json.data];
        this.count = this.questions.length;
        this.prevIndexFile = json.prev;

        if (this.count == 1) {
          this.fetchPrevIndex();
        }
      });
    } else {
      this.questions = [];
    }
  }

  loaded(e: any) {
    if (this.questions[this.offset].id == e.id) {
      this.showPaginator.next(!!e.loaded);
    }
  }

  response(e: any) {
    console.log(e);
  }
}
