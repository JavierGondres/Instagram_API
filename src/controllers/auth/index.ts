import { Request, Response } from "express";
import { v4 } from "uuid";
import { Roles } from "../../types/enum.js";
import { AuthModel } from "../../models/auth/index.js";
import { CustomError } from "../../utils/CustomErrors/index.js";
import { AuthResponse, SignInPayload, SignUpPayload } from "./types.js";

export class AuthController {
   private authModel: AuthModel;

   constructor(authModel: AuthModel) {
      this.authModel = authModel;
   }

   signIn = async (req: Request, res: Response) => {
      const { email, password }: SignInPayload = req.body;
      let result: AuthResponse = {
         error: false,
         message: "Something went wrong",
      };

      try {
         result = await this.authModel.signIn({ email, password });
         return res.status(result.error ? 400 : 200).json(result);
      } catch (e) {
         console.error(e);
         result.error = true;
         result.message = "Internal server error";
         return res.status(501).json(result);
      }
   };

   signUp = async (req: Request, res: Response) => {
      const {
         email,
         fullName,
         password,
         userName,
         profilePicture,
         role,
      }: SignUpPayload = req.body;
      let result: AuthResponse = {
         error: false,
         message: "Something went wrong",
      };

      try {
         const _id = v4();
         result = await this.authModel.signUp({
            _id,
            userName,
            email,
            fullName,
            password,
            profilePicture,
            role: role || Roles.USER,
         });
         return res.status(result.error ? 400 : 200).json(result);
      } catch (e) {
         console.error(e);
         result.error = true;
         result.message = "Internal server error";
         return res.status(501).json(result);
      }
   };

   signOut = async (req: Request, res: Response) => {
      let result: AuthResponse = {
         error: false,
         message: "Sign out successful",
      };

      try {
         const sessionId = req.decodedSessionId;
         if (!sessionId) {
            throw new CustomError("Session ID not found", 400);
         }

         result = await this.authModel.signOut(sessionId);
         return res.status(result.error ? 400 : 200).json(result);
      } catch (e) {
         if (e instanceof CustomError) {
            return res
               .status(e.statusCode)
               .json({ error: true, message: e.message });
         }
         console.error(e);
         result.error = true;
         result.message = "Internal server error";
         return res.status(501).json(result);
      }
   };
}
