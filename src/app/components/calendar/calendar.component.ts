import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Input() year = new Date().getFullYear();
  @Input() month = new Date().getMonth() + 1;
  @Input() relpath = '';
  constructor() {}

  weekDays = 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'
    .split(',')
    .map((a) => ({ title: a }));
  monthNames = 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(',');
  grid: any[][] = [];

  ngOnInit(): void {
    let fi = new Date(`${this.year}-${this.month}-1`).getDay();
    let rc = 7,
      cc = 7;
    while (this.grid.length < rc) {
      let row = [];
      while (row.length < cc) {
        if (this.grid.length) {
          let dt: number = (this.grid.length - 1) * cc + row.length - fi + 1;

          if (dt) {
            let cdt = new Date(`${this.year}-${this.month}-${dt}`);
            if (cdt.getDate() == dt) {
              let lbl: any = {
                title: dt,
              };
              if (cdt.getTime() < Date.now() - 24 * 3600 * 1000) {
                lbl.path =
                  (this.month < 10 ? '0' : '') +
                  this.month +
                  '/' +
                  (dt < 10 ? '0' : '') +
                  dt;
              }
              row.push(lbl);
            } else {
              row.push(null);
            }
          } else {
            row.push(null);
          }
        } else {
          row.push(this.weekDays[row.length]);
        }
      }
      if (row.filter((a) => a != null).length) {
        this.grid.push(row);
      } else {
        rc--;
      }
    }
    //console.log(this.year, this.month, this.grid);
  }
}
