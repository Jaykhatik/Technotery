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

export interface PageProps {
  params: Promise<{ userId: string }>;
}

export interface UserDetailCardProps {
  initialUser: User;
}

export interface RouteParams {
  params: Promise<{ userId: string }>;
}

export interface UserCardProps {
  user: User;
}


