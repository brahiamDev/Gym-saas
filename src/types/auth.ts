export interface User {
  id: string;
  email: string;
  fullName?: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  user: User;
}