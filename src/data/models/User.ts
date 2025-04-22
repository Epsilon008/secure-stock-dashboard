
export interface User {
  id: string;
  username: string;
  role: "admin" | "user";
  email?: string;
  fullName?: string;
  department?: string;
  createdAt?: string | Date;
  lastLogin?: string | Date;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface RegisterUserData {
  username: string;
  password: string;
  department?: string;
  email?: string;
  fullName?: string;
}
