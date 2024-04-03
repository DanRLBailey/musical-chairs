export interface User {
  isLoggedIn: boolean;
  displayName: string;
  email: string;
  userId: number;
}

export interface UserDB {
  id: number;
  created_at: Date;
  email: string;
  password: string;
  last_login: Date;
  display_name: string;
}
