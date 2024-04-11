import { Request, Response } from "express";
import { v4 } from "uuid";
import { Roles } from "../../types/enum.js";
import { AuthModel } from "../../models/auth/index.js";
import { SignInPayload, SignUpPayload } from "./types.js";

export class AuthController {
   private authModel: AuthModel;

   constructor(authModel: AuthModel) {
      this.authModel = authModel;
   }

   signIn = async (req: Request, res: Response) => {
      const { email, password }: SignInPayload = req.body;
      const client = req.headers["user-agent"]

      try {
         const result = await this.authModel.signIn({ email, password, client: client ?? "No client"});
         return res.status(result.status).json(result);
      } catch (e) {
         console.error(e);
         return res.status(501).json("Internal server error");
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
      try {
         const _id = v4();
         const result = await this.authModel.signUp({
            _id,
            userName,
            email,
            fullName,
            password,
            profilePicture,
            role: role || Roles.USER,
         });
         return res.status(result.status).json(result);
      } catch (e) {
         console.error(e);
         return res.status(501).json("Internal server error");
      }
   };

   signOut = async (req: Request, res: Response) => {
      try {
         const sessionId = req.decodedSessionId;
         if (!sessionId) {
            return res.status(401).json("Missing credentials");
         }

         const result = await this.authModel.signOut(sessionId);
         return res.status(result.status).json(result);
      } catch (e) {
         console.error(e);
         return res.status(501).json("Internal server error");
      }
   };
}
