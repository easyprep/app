import { SUPER_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { OfflineCache } from '../interfaces/offline-cahce';
import { Label } from '../interfaces/label';
import { Practice } from '../interfaces/practice';

@Injectable({
  providedIn: 'root',
})
export class IdbService extends Dexie {
  offlineCahces: Dexie.Table<OfflineCache, string>;
  labels: Dexie.Table<Label, string>;
  practice: Dexie.Table<Practice, string>;

  constructor() {
    super('easy-prep');
    this.version(1).stores({
      offlinecahces: 'path',
      labels: 'path',
      practice: 'id',
    });
    this.offlineCahces = this.table('offlinecahces');
    this.labels = this.table('labels');
    this.practice = this.table('practice');

    this.offlineCahces.count(console.log);
  }
}
