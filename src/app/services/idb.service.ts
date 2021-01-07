import { SUPER_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { IndexFile } from '../interfaces/index-file';
import { Label } from '../interfaces/label';
import { Question } from '../interfaces/question';

@Injectable({
  providedIn: 'root',
})
export class IdbService extends Dexie {
  questions: Dexie.Table<Question, string>;
  labels: Dexie.Table<Label, string>;
  indexfiles: Dexie.Table<IndexFile, number>;

  constructor() {
    super('easy-prep');
    this.version(1).stores({
      questions: 'id,updated_at,*labels',
      labels: 'id,title,parent',
      indexfiles: 'ts,synced',
    });
    this.questions = this.table('questions');
    this.labels = this.table('labels');
    this.indexfiles = this.table('indexfiles');
  }
}
