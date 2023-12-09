export interface ApiResponse<T> {
  message: string;
  token: string;
  result: T;
}
