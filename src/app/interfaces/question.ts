export interface Question {
  id: string;
  created_at?: Date;
  updated_at?: Date;
  question?: string;
  options?: string[];
  answer?: string;
  explanation?: string;
  labels?: string[];
}
