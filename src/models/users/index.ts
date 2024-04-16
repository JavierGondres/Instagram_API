import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { SignUpPayload } from "./types.js";
import { Users } from "../../types/identidades.js";
import { CustomResponse } from "../../utils/Reponse/response.js";

export class UserModel {
   async getHashPassword(password: string, saltOrRounds: number) {
      try {
         const passwordHash = await bcrypt.hash(password, saltOrRounds);
         return passwordHash;
      } catch (error) {
         console.error("Error, couldnt hash password: ", error);
         CustomResponse.error(500, "couldnt hash password");
      }
   }

   async getIsValidPassword(unHashedPassword: string, hashedPassword: string) {
      try {
         const isValidPassword = await bcrypt.compare(
            unHashedPassword,
            hashedPassword
         );

         return isValidPassword;
      } catch (error) {
         console.error("Error, couldnt validate password: ", error);
         CustomResponse.error(500, "Error, couldnt validate password: ");
      }
   }

   async create(payload: SignUpPayload) {
      try {
         const { password, ...rest } = payload;
         const passwordHash = await this.getHashPassword(password, 8);
         const _id = uuidv4();

         const newUser: Users = {
            ...rest,
            password: passwordHash,
            role: rest.role || "User",
            _id,
         };

         return newUser;
      } catch (error) {
         console.error("Error creating user:", error);
         CustomResponse.error(500, "couldnt create user");
      }
   }
}
