import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {
  status: any | null = null;
  constructor(public api: ApiService) {}

  ngOnInit(): void {
    this.api.get('status.json').subscribe((json) => (this.status = json));
  }
}
