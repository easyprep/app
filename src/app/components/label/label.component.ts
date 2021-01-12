import { Component, OnInit, Input } from '@angular/core';
import { Label } from 'src/app/interfaces/label';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {
  @Input() label: Label | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
