import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, pipe, of, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IdbService } from './idb.service';
import { Question } from '../interfaces/question';
import { Label } from '../interfaces/label';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  shortTermCacheTime = 60 * 60 * 1000; // ms
  longTermCacheTime = 30 * 24 * 60 * 60 * 1000; // ms

  baseUrl = 'https://easyprep.github.io/api/';

  cache: any = {};

  constructor(private http: HttpClient, private idb: IdbService) {}

  get(path: string = '', refresh: boolean = false): Observable<any> {
    if (!path.endsWith('.json') && !path.endsWith('/')) path += '/';

    if (this.cache[path]) {
      if (refresh) {
        this.refreshPath(path);
      }
    } else {
      this.cache[path] = new BehaviorSubject(null);

      this.idb.offlineCahces.get(path).then((cache) => {
        if (cache) {
          this.cache[path].next(cache.json);
          if (cache.expiry < Date.now()) {
            this.refreshPath(path);
          }
        } else {
          this.refreshPath(path);
        }
      });
    }
    return this.cache[path];
  }

  refreshPath(path: string) {
    this.http.get(this.baseUrl + path).subscribe(
      (json) => {
        let expiry = Date.now();

        if (path.startsWith('questions') || !path.endsWith('/')) {
          expiry += this.longTermCacheTime;
        } else {
          expiry += this.shortTermCacheTime;
        }

        this.idb.offlineCahces
          .put({
            path,
            json,
            expiry,
          })
          .then(() => {
            this.cache[path].next(json);
          });
      },
      (err) => {
        this.cache[path].next(err);
      }
    );
  }
}
