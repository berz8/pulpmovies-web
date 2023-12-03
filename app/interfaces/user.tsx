export interface User {
  id: number;
  username: string;
  email: string;
  birthday: string;
  biography: string;
  profilePath: any;
  accountStatus: string;
  fullName: string;
  onboarding: number;
}

export interface AuthenticatedUser {
  token: string;
  user: User;
}
