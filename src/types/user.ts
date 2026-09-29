export type User = {
  id: string;
  name: string;
  email: string;
  role?:  "full" | "register"  | "viewer";
}
