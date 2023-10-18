export interface ApiResponse<T> {
  message: string
  token: {
    access_token: string
    refresh_token: string 
  }
  result: T
}
