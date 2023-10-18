export interface User {
  id: number
  username: string
  email: string
  birthday: string
  biography: string
  profilePath: any
  accountStatus: string
  fullName: string
  Onboarding: boolean
  CreatedAt: string
  UpdatedAt: string
}

export interface AuthenticatedUser {
  token: {
   access_token: string
    refresh_token: string 
  }
  user: User
}
