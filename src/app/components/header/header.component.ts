import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Observable, merge, of, fromEvent, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() title: any;

  isConnected: Observable<boolean>;

  constructor(public auth: AuthService) {
    this.isConnected = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    );
  }

  ngOnInit(): void {}
}
