import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
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
  question: any = {};
  questionIndex: number = 0;
  showAnswer: boolean = false;
  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    this.route.url.subscribe((segments) => {
      this.quizzes = [];
      this.questions = [];
      this.question = null;
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
    this.showAnswer = false;
    this.question = this.api
      .get('questions/' + id + '.json')
      .subscribe((json) => {
        this.question = json;
      });
  }
  checkAnswer(i: number, e: any) {
    this.showAnswer = true;
    if (this.question.answer == i + '') {
      e.target.classList.add('bg-success');
    } else {
      e.target.classList.add('bg-danger');
    }
    e.target.classList.add('text-light');
  }
}
