import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IdbService } from 'src/app/services/idb.service';
import { Label } from 'src/app/interfaces/label';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss']
})
export class LabelsComponent implements OnInit {
  label: string | null = null;
  children: Label[] = [];
  constructor(private route: ActivatedRoute, private idb: IdbService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.label = params.label || "_top_";
      console.log(this.label);
      this.idb.labels.where({ parent: this.label }).toArray().then(arr => this.children = arr);
    });
  }

}
