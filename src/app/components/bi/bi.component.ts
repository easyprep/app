import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bi',
  templateUrl: './bi.component.html',
  styleUrls: ['./bi.component.scss'],
})
export class BiComponent implements OnInit {
  @Input() icon: string = '';
  constructor() {}

  ngOnInit(): void {}
}
