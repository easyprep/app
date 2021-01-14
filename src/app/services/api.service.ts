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
      } else {
        console.log('From Cache :' + path);
      }
    } else {
      this.cache[path] = new BehaviorSubject(null);
      this.idb.offlineCahces.get(path).then((cache) => {
        if (cache) {
          console.log('From IDB :' + path);
          this.cache[path].next(cache.json);
          //console.log((cache.expiry - Date.now()) / 1000);
          if (cache.expiry < Date.now()) {
            console.log('Cache Expired : ' + path);
            this.refreshPath(path);
          }
        } else {
          this.refreshPath(path);
        }
      });
    }
    //console.log(this.cache);
    return this.cache[path];
  }

  refreshPath(path: string) {
    console.log('Loading... : ' + path);
    this.http.get(this.baseUrl + path).subscribe(
      (json) => {
        let expiry = Date.now();

        if (path.startsWith('questions') || !path.endsWith('/')) {
          expiry += 30 * 24 * 60 * 60 * 1000;
        } else {
          expiry += 30 * 1000;
        }

        this.idb.offlineCahces
          .put({
            path,
            json,
            expiry,
          })
          .then(() => {
            console.log('From server : ' + path);
            this.cache[path].next(json);
          });
      },
      (err) => {
        console.log('Error : ' + path);
        this.cache[path].next(err);
      }
    );
  }
}
