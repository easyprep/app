import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IdbService } from './idb.service';
import { Question } from '../interfaces/question';
import { Label } from '../interfaces/label';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = 'https://nkadebug.github.io/easy-prep-api/';
  constructor(private http: HttpClient, private idb: IdbService) {}

  get(path: string = ''): Observable<any> {
    console.log(path);
    return this.http.get(this.baseUrl + path);
  }

  sync(path?: string) {
    let ts = 0;
    if (!path) {
      path = 'data.json';
    } else {
      ts = parseInt(path.split(/[-.]/)[1]);
    }

    this.get('indexfiles/' + path).subscribe((json) => {
      console.log(json);
      let labels: any = {};
      let questions = json.indexData.map((q: any) => {
        q.labels = q.labels.replace(/[ ]/g, '-').toLowerCase().split(',');
        q.labels.forEach((label: string, i: number) => {
          labels[label] = {
            id: label,
            title:
              label.match(/[a-z]/g) == null
                ? label
                : label.replace(/[-]/g, ' ').toUpperCase(),
            parent: i == 0 ? '_top_' : q.labels[i - 1],
          };
        });
        return q;
      });

      this.idb.questions
        .bulkGet(questions.map((q: any) => q.id))
        .then((arr) => {
          let qArr: any[] = [];
          arr.forEach((a, i) => {
            if (!a) {
              qArr.push(questions[i]);
            }
          });
          console.log(qArr.length);
          if (qArr.length) {
            console.time('bulkput-questions');
            this.idb.questions
              .bulkPut(qArr)
              .then(() => console.timeEnd('bulkput-questions'));
          }
        });

      labels = Object.keys(labels).map((id) => labels[id]);
      this.idb.labels.bulkGet(labels.map((a: any) => a.id)).then((arr) => {
        let lArr: any[] = [];
        arr.forEach((a, i) => {
          if (!a) {
            lArr.push(labels[i]);
          }
        });
        if (lArr.length) {
          console.time('bulkput-labels');
          this.idb.labels
            .bulkPut(lArr)
            .then(() => console.timeEnd('bulkput-labels'));
        }
      });

      if (ts) {
        this.idb.indexfiles.put({ ts, synced: new Date() });
      }
      if (json.prev) {
        let prevTs = parseInt(json.prev.split(/[-.]/)[1]);
        this.idb.indexfiles
          .where({ ts: prevTs })
          .toArray()
          .then((arr) => {
            if (!arr.length) {
              this.sync(json.prev);
            } else {
              console.log(`${path} already synced at ${arr[0].synced}`);
            }
          });
      }
    });
  }
}
