import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, pipe, of } from 'rxjs';
import { map, tap } from 'rxjs/operators'
import { IdbService } from './idb.service';
import { Question } from '../interfaces/question';
import { Label } from '../interfaces/label';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = 'https://nkadebug.github.io/easy-prep-api/';

  constructor(private http: HttpClient, private idb: IdbService) { }

  get(path: string = ''): Observable<any> {
    if (!path.endsWith('.json') && !path.endsWith('/')) path += '/';
    return from(
      this.idb.offlineCahces.get(path)
        .then((cache) => {
          if (!cache || cache.expiry < Date.now()) {
            return this.http.get(this.baseUrl + path)
              .pipe(
                tap(json => {
                  this.idb.offlineCahces.put({ path, json, expiry: Date.now() + 1 * 60 * 1000 });
                })
              ).toPromise();
          } else {
            return cache.json;
          }
        })
        .catch(e => {
          return { err: true, msg: e.message, path }
        })
    );
  }

}
