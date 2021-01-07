import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IdbService } from './idb.service';
import { Question } from '../interfaces/question';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = 'https://nkadebug.github.io/easy-prep-api/';
  constructor(private http: HttpClient, private idb: IdbService) { }

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
      this.idb.questions.bulkPut(json.indexData.map((q: any) => {
        q.labels = q.labels.split(',');
        return q;
      }));
      if (ts) {
        this.idb.indexfiles.put({ ts, synced: new Date() });
      }
      if (json.prev) {
        let prevTs = parseInt(json.prev.split(/[-.]/)[1]);
        this.idb.indexfiles.where({ ts: prevTs }).toArray().then(arr => {
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
