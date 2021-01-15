import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces/question';
import { IdbService } from 'src/app/services/idb.service';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Label } from 'src/app/interfaces/label';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { Practice } from 'src/app/interfaces/practice';

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

  uid: string = '';

  prevAttempts: any = {};

  revisionInterval = 24 * 3600 * 1000; //ms

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private idb: IdbService
  ) {}

  ngOnInit(): void {}

  next() {
    this.offset++;
    if (this.uid) {
      this.getPrevAttempts();
    } else {
      this.auth.user.subscribe((user) => {
        if (!user) return;
        console.log(user);
        this.uid = user.id;
        this.getPrevAttempts();
      });
    }

    if (this.count - this.offset == 1) {
      this.fetchPrevIndex();
    }
  }

  prev() {
    this.offset--;
  }

  getPrevAttempts() {
    this.idb.practice
      .get(this.uid + '/' + this.questions[this.offset].id)
      .then((doc) => {
        let flag = false;
        if (doc) {
          if (doc.attempts[0].ts > Date.now() - this.revisionInterval) {
            flag = doc.attempts[0].attempt;
          } else {
            console.log(
              this.questions[this.offset].id,
              doc.attempts.slice(0, 3).map((a) => a.attempt)
            );
            flag =
              doc.attempts.slice(0, 3).filter((a) => a.attempt).length == 3;
          }
        }
        // console.log(this.questions[this.offset].id, flag);
        if (flag) this.next();
      });
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
        this.offset = -1;
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

        this.next();
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
    let id = this.uid + '/' + e.id;
    this.idb.practice.get(id).then((doc) => {
      if (doc) {
        //doc.attempts.splice(0, 0, { ts: Date.now(), attempt: e.correct });
        doc.attempts = [
          { ts: Date.now(), attempt: e.correct },
          ...doc.attempts.slice(0, 4),
        ];
      } else {
        doc = { id, attempts: [{ ts: Date.now(), attempt: e.correct }] };
      }
      doc.attempts = doc.attempts.slice(0, 5);
      this.idb.practice.put(doc);
    });
  }
}
