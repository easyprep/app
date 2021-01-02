import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = "https://nkadebug.github.io/easy-prep-api/";
  constructor(private http: HttpClient) { }

  get(path: string = ""): Observable<any> {
    console.log(path);
    return this.http.get(this.baseUrl + path);
  }
}
