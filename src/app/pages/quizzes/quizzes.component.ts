import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { validate as uuidValidate } from 'uuid';

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.scss'],
})
export class QuizzesComponent implements OnInit {
  quizzes: any[] = [];
  questions: any[] = [];
  question: any = null;
  questionIndex: number = 0;
  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    this.route.url.subscribe((segments) => {
      this.quizzes = [];
      this.questions = [];
      this.questionIndex = 0;
      let path = segments.map((a) => a.path).join('/');
      this.api.get('quizzes/' + path).subscribe((json) => {
        for (let key in json) {
          if (uuidValidate(key)) {
            this.questions.push({ id: key, ts: json[key] });
          } else {
            this.quizzes.push({
              id: key,
              ts: json[key],
              title: key.replace(/-/g, ' '),
            });
          }
        }
        this.quizzes.sort((a, b) => (b.id > a.id ? 1 : -1));
        if (this.questions.length) {
          this.getQuestion(this.questions[this.questionIndex].id);
        }
      });
    });
  }

  next() {
    this.questionIndex++;
    this.getQuestion(this.questions[this.questionIndex].id);
  }
  prev() {
    this.questionIndex--;
    this.getQuestion(this.questions[this.questionIndex].id);
  }

  getQuestion(id: string) {
    this.question = this.api.get('questions/' + id + '.json');
  }
}
