export interface User {
  isLoggedIn: boolean;
  email: string;
  userName: string;
  displayName: string;
  userId: number;
  saved: number[];
}

export interface UserDB {
  id: number;
  created_at: Date;
  email: string;
  password: string;
  last_login: Date;
  display_name: string;
  user_name: string;
  saved: string;
}
