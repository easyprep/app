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
  y = 2021;
  m = 1;
  constructor(private api: ApiService) { }

  ngOnInit(): void {

    //this.api.get('labels/current-affairs/2018/02/03').subscribe(json => console.log(json));
  }
}
