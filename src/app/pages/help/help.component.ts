import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { IdbService } from 'src/app/services/idb.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {
  status: any = {
    questions: 0,
    labels: 0,
  };
  constructor(public idb: IdbService) { }

  ngOnInit(): void {
    //this.idb.questions.count().then((c) => (this.status.questions = c));
    //this.idb.labels.count().then((c) => (this.status.labels = c));
  }
}
