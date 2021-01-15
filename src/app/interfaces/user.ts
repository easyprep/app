export interface User {
  id: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  lastSignInTime: string | undefined;
}
