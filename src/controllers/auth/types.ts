import { Roles } from "../../types/enum.js";

export interface SignInPayload {
   email: string;
   password: string;
}

export interface SignUpPayload {
   _id: string;
   userName: string;
   email: string;
   fullName: string;
   password: string;
   profilePicture: string | null;
   role?: Roles;
}

export interface AuthResponse {
   error: boolean;
   message: string;
   [key: string]: any;
}
