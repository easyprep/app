import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { IdbService } from 'src/app/services/idb.service';
import { Label } from 'src/app/interfaces/label';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss'],
})
export class LabelsComponent implements OnInit {
  @Input() page: string = '';
  @Output() showQuestions = new EventEmitter<any>();

  breadcrumbs: any[] = [];
  path: string = '';
  subLabels: Label[] = [];
  questions: any[] = [];

  showSubLabels = false;
  showCalendars = false;
  calendars: any[] = [];
  showLoading = true;
  showError = false;
  errorMsg = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe((segments: UrlSegment[]) => {
      this.showLoading = true;
      this.showCalendars = false;

      this.path =
        segments.map((a) => a.path).join('/') + (segments.length ? '/' : '');

      this.breadcrumbs = (this.page + '/' + this.path)
        .split('/')
        .filter((a) => !!a)
        .map((a, i, l) => {
          return {
            title: a.replace(/-/g, ' '),
            path: l.slice(0, i + 1).join('/'),
          };
        });

      this.api.get('labels/' + this.path).subscribe((json) => {
        if (!json) return;
        console.log(json);

        this.showLoading = false;

        this.showError = !!json.error;
        this.errorMsg = json.message;

        if (json.error) {
          return;
        }

        if (json.type == '_folder') {
          this.subLabels = json.data.map((a: any) => {
            let label = { path: a, title: a.replace(/-/g, ' ') };

            return label;
          });

          if (this.path.indexOf('current-affairs') > -1) {
            this.subLabels = this.subLabels.sort((a, b) =>
              a.path > b.path ? -1 : 1
            );
          }

          this.showSubLabels = true;

          if (segments.length >= 2) {
            if (segments[0].path == 'current-affairs') {
              if (segments.length == 2) {
                this.calendars = this.subLabels.map((a) => {
                  return {
                    y: parseInt(segments[1].path),
                    m: parseInt(a.title),
                    p: '',
                  };
                });
              } else if (segments.length == 3) {
                this.calendars = [
                  {
                    y: parseInt(segments[1].path),
                    m: parseInt(segments[2].path),
                    p: '../',
                  },
                ];
              }

              this.showCalendars = true;
              this.showSubLabels = false;
            }
          } else {
            this.showCalendars = false;
          }

          this.showQuestions.emit(null);
        } else if (json.type == '_file') {
          this.showSubLabels = false;
          this.showCalendars = false;

          this.showQuestions.emit(this.path);
        }
      });
    });
  }
}
