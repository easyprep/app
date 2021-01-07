import { SUPER_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { IndexFile } from '../interfaces/index-file';
import { Question } from '../interfaces/question';

@Injectable({
  providedIn: 'root',
})
export class IdbService extends Dexie {
  questions: Dexie.Table<Question, string>;
  indexfiles: Dexie.Table<IndexFile, number>;

  constructor() {
    super('easy-prep');
    this.version(1).stores({
      questions: 'id,updated_at,*labels',
      indexfiles: 'ts,synced',
    });
    this.questions = this.table('questions');
    this.indexfiles = this.table('indexfiles');
  }
}
