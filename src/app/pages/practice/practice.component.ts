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

  offset = -1;
  limit = 1;

  constructor(private idb: IdbService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.offset = -1;
    console.time('route.params');
    this.route.params.subscribe((params) => {
      console.timeEnd('route.params');
      this.label = params.label;
      console.log(this.label);

      console.time('labelObj');
      this.idb.labels.get(this.label).then((l: any) => {
        console.timeEnd('labelObj');
        this.labelObj = l;
        console.log(this.labelObj);
      });

      // console.time('qc');
      // this.idb.questions
      //   .where('labels')
      //   .equalsIgnoreCase(this.label)
      //   .count()
      //   .then((c) => {
      //     console.timeEnd('qc');
      //     this.labelQuestionCount = c;
      //     console.log(c);
      //     this.next();
      //   });
      this.next();
    });
  }

  next() {
    this.offset++;
    this.get();
  }
  prev() {
    this.offset--;
    this.get();
  }
  get() {
    console.time('next');
    // let offset = Math.floor(Math.random() * this.labelQuestionCount);
    this.idb.questions
      .where('labels')
      .equalsIgnoreCase(this.label)
      .reverse()
      .sortBy('updated_at')
      .then((arr) => {
        console.log(arr.length, this.offset, this.limit);
        this.questions = arr.slice(this.offset, this.offset + this.limit);
        console.timeEnd('next');
      });
  }

  response(id: string, e: any) {
    console.log(id, e);
  }
}
