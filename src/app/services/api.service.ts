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
  baseUrl = 'https://nkadebug.github.io/easy-prep-api/';

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
        } else {
          this.refreshPath(path);
        }
      });
    }
    console.log(this.cache);
    return this.cache[path];

    // return from(
    //   this.idb.offlineCahces.get(path)
    //     .then((cache) => {
    //       if (!cache || cache.expiry < Date.now()) {
    //         return this.http.get(this.baseUrl + path)
    //           .pipe(
    //             tap(json => {
    //               this.idb.offlineCahces.put({ path, json, expiry: Date.now() + 24 * 60 * 60 * 1000 });
    //             })
    //           ).toPromise();
    //       } else {
    //         return cache.json;
    //       }
    //     })
    //     .catch(e => {
    //       return { err: true, msg: e.message, path }
    //     })
    // );
  }

  refreshPath(path: string) {
    this.http.get(this.baseUrl + path).subscribe(
      (json) => {
        this.cache[path].next(json);
        this.idb.offlineCahces.put({
          path,
          json,
          expiry: Date.now() + 24 * 60 * 60 * 1000,
        });
      },
      (err) => {
        switch (err.status) {
          case 0: {
            err.message =
              'Unknown Error. May have occured due to network. Check connectivity / Retry After sometime';
            break;
          }

          case 404: {
            err.message = 'Not Found : ' + path;
            break;
          }

          case 504: {
            err.message = 'Gateway Timeout';
            break;
          }

          default:
        }

        this.cache[path].next(err);
      }
    );
  }

  // get(path: string = ''): Observable<any> {
  //   if (!path.endsWith('.json') && !path.endsWith('/')) path += '/';
  //   return from(
  //     this.idb.offlineCahces.get(path)
  //       .then((cache) => {
  //         if (!cache || cache.expiry < Date.now()) {
  //           return this.http.get(this.baseUrl + path)
  //             .pipe(
  //               tap(json => {
  //                 this.idb.offlineCahces.put({ path, json, expiry: Date.now() + 24 * 60 * 60 * 1000 });
  //               })
  //             ).toPromise();
  //         } else {
  //           return cache.json;
  //         }
  //       })
  //       .catch(e => {
  //         return { err: true, msg: e.message, path }
  //       })
  //   );
  // }
}
