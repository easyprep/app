export interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  created_at: Date;
  updated_at: Date;
}
