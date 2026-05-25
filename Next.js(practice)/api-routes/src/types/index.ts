export interface User {
  userId: number;
  userName: string;
  age: number;
  city: string;
  email: string;
}

export interface ApiResponse {
  message: string;
  data: User[];
}
