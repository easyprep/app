import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/interfaces/question';
import { IdbService } from 'src/app/services/idb.service';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Label } from 'src/app/interfaces/label';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss'],
})
export class PracticeComponent implements OnInit {
  label = '';
  labelObj: Label | null = null;
  labelQuestionCount = 0;
  questions: Question[] = [];
  constructor(private idb: IdbService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.label = params.label;
      this.idb.labels.get(this.label).then((l: any) => {
        this.labelObj = l;
      });
      this.idb.questions
        .where('labels')
        .equalsIgnoreCase(this.label)
        .count()
        .then((c) => {
          this.labelQuestionCount = c;
          this.next();
        });
    });
  }

  next() {
    console.time('next');
    let offset = Math.floor(Math.random() * this.labelQuestionCount);
    this.idb.questions
      .where('labels')
      .equalsIgnoreCase(this.label)
      .offset(offset)
      .limit(5)
      .toArray()
      .then((arr) => {
        this.questions = arr;
        console.timeEnd('next');
      });
  }

  response(id: string, e: any) {
    console.log(id, e);
  }
}
