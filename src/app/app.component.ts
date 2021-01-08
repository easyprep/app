import { AfterViewChecked, AfterViewInit, Component } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'Easy Prep 🚀';
  constructor(private api: ApiService) { }
  ngAfterViewInit() {
    setTimeout(() => {
      //this.api.sync();
      console.log('Sync skkiped');
    }, 1000);
  }
}
