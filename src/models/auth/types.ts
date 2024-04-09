import { Users } from "../../types/identidades.js";

export interface SignUpPayload extends Omit<Users, "password"> {
   password: string;
}

export interface SignInPayload {
   email: string;
   password: string;
}
