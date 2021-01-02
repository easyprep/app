import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.get("quizzes").subscribe(data => console.log(data));
    this.api.get("quizzes/current-affairs").subscribe(data => console.log(data));
    this.api.get("quizzes/current-affairs/2016-12-17").subscribe(data => console.log(data));

  }

}
