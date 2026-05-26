export type AuthStatus = "idle" | "loading" | "authenticated" | "error" | "unauthenticated";

export type AuthState =
  | { status: "loading";         user: null;  error: null }
  | { status: "unauthenticated"; user: null;  error: string | null }
  | { status: "authenticated";   user: User;  error: null }

export type AuthContextValue = AuthState & {
  setUser: (user: User) => void
  logout: () => void
}

// role: text('role', { enum: ['user', 'staff', 'admin'] }).notNull().default('user'), 

export interface User {
  id: number;
  email: string;
  password: string | null;
  verifiedEmail: boolean;
  name: string;
  givenName: string;
  familyName: string;
  picture: string;
  locale: string;
  createdAt: string;
  bio: string;
  role: "user" | "staff" | "admin";
}
