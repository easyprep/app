import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { IdbService } from 'src/app/services/idb.service';
import { Label } from 'src/app/interfaces/label';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss'],
})
export class LabelsComponent implements OnInit {
  @Input() page: string | null = null;
  @Output() showQuestions = new EventEmitter<string>();
  labels: string[] = [];
  label: string | null = null;
  children: Label[] = [];

  childLabel = new FormControl('-');
  myForm = new FormGroup({});

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private idb: IdbService
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe((segments: UrlSegment[]) => {
      console.log(segments);
      this.labels = segments.map((a) => a.path);
      this.labels.splice(0, 0, '_top_');
      //if (this.labels.length == 0) this.labels.push('_top_');
      this.label = this.labels[this.labels.length - 1];
      console.log(this.label);
      this.idb.labels
        .where({ parent: this.label })
        .toArray()
        .then((arr) => {
          if (this.label == 'current-affairs') {
            this.children = arr.sort((a, b) => (a.id > b.id ? -1 : 1));
          } else {
            this.children = arr.sort((a, b) => (a.id > b.id ? 1 : -1));
          }

          if (!arr.length) {
            this.showQuestions.emit(this.label?.toString());
          } else {
            this.showQuestions.emit('');
          }
        });
    });

    this.childLabel.valueChanges.subscribe((date) => {
      if (date != '-') {
        this.router
          .navigate([
            this.page,
            ...this.labels.slice(1, this.labels.length),
            date,
          ])
          .then(() => {
            this.childLabel.setValue('-');
          });
      }
    });
  }
}
