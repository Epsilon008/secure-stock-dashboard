
export interface User {
  id: string;
  username: string;
  role: "admin" | "user";
  email?: string;
  fullName?: string;
  department?: string;
  createdAt?: Date;
  lastLogin?: Date;
}

export interface AuthCredentials {
  username: string;
  password: string;
}
