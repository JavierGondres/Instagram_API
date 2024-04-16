import { Users } from "../../types/identidades.js";

export interface SignUpPayload extends Omit<Users, "password" | "_id"> {
   password: string;
}

export interface SignInPayload {
   email: string;
   password: string;
   client: string;
}
