export interface Question {
  id: string;
  created_at: Date;
  updated_at: Date;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  option5: string;
  answer: string;
  explanation: string;
  labels: string;
}
