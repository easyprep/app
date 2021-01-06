import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IdbService } from './idb.service';

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
    this.get('index/' + path).subscribe((json) => {
      console.log(json);
      let arr = [];
      for (let k in json.indexData) {
        arr.push({ id: k, ...json.indexData[k] });
      }
      this.idb.questions.bulkPut(arr);
      if (ts) {
        this.idb.indexfiles.put({ ts, synced: new Date() });
      }
      if (json.prev) {
        this.sync(json.prev);
      }
    });
  }
}
