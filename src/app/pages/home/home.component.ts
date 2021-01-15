import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces/question';
import { ApiService } from 'src/app/services/api.service';
import { IdbService } from 'src/app/services/idb.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  y = new Date().getFullYear();
  m = new Date().getMonth() + 1;
  d: string[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api
      .get(
        'labels/current-affairs/' +
          this.y +
          '/' +
          (this.m < 10 ? '0' : '') +
          this.m +
          '/'
      )
      .subscribe((json) => {
        if (!json) return;
        this.d = json.data
          .sort((a: string, b: string) => (a > b ? -1 : 1))
          .slice(0, 3);
      });
  }
}
